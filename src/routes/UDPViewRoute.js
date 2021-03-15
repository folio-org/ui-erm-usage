import React, { useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'compose-function';
import { get, isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import UDP from '../components/views/UDP';
import withReportHandlers from './components/withReportHandlers';
import urls from '../util/urls';
import extractHarvesterImpls from '../util/harvesterImpls';

function UDPViewRoute(props) {
  const {
    handlers,
    mutator,
    resources,
    stripes,
    tagsEnabled,
    match: {
      params: { id },
    },
  } = props;

  const handleClose = () => {
    props.history.push(`${urls.udps()}${props.location.search}`);
  };

  const handleEdit = () => {
    const { location, match } = props;
    props.history.push(`${urls.udpEdit(match.params.id)}${location.search}`);
  };

  const getRecord = (udpId) => {
    return get(resources, 'usageDataProvider.records', []).find(
      (i) => i.id === udpId
    );
  };

  const getCounterReports = (udpId) => {
    const records = (resources.counterReports || {}).records || null;
    const reports = !isEmpty(records) ? records[0].counterReportsPerYear : [];
    if (
      !isEmpty(reports) &&
      reports[0].reportsPerType[0].counterReports[0].providerId === udpId
    ) {
      return reports;
    } else {
      return [];
    }
  };

  const getCustomReports = (udpId) => {
    const reports = get(
      resources,
      'customReports.records[0].customReports',
      []
    );
    if (!isEmpty(reports) && reports[0].providerId === udpId) {
      return reports;
    } else {
      return [];
    }
  };

  const isLoading = () => {
    const { match } = props;

    return (
      match.params.id !== get(resources, 'usageDataProvider.records[0].id') &&
      get(resources, 'usageDataProvider.isPending', true)
    );
  };

  const isStatsLoading = () => {
    return (
      get(resources, 'customReports.isPending', true) ||
      get(resources, 'counterReports.isPending', true)
    );
  };

  const isHarvesterExistent = () => {
    return props.stripes.hasInterface('erm-usage-harvester');
  };

  const selectedRecord = getRecord(id);
  const counterReports = getCounterReports(id);
  const customReports = getCustomReports(id);
  const settings = get(resources, 'settings.records', []);
  const harvesterImpls = extractHarvesterImpls(resources);
  const statsReloadCount = get(resources, 'statsReloadToggle', 0);
  const udpReloadCount = get(resources, 'udpReloadToggle', 0);
  return (
    <>
      <UDP
        canEdit={stripes.hasPerm('usagedataproviders.item.put')}
        data={{
          counterReports,
          customReports,
          harvesterImpls,
          settings,
          usageDataProvider: selectedRecord,
        }}
        handlers={{
          ...handlers,
          onClose: handleClose,
          onEdit: handleEdit,
        }}
        isHarvesterExistent={isHarvesterExistent()}
        isLoading={isLoading()}
        isStatsLoading={isStatsLoading()}
        mutator={mutator}
        statsReloadCount={statsReloadCount}
        stripes={stripes}
        tagsEnabled={tagsEnabled}
        udpReloadCount={udpReloadCount}
      />
    </>
  );
}

UDPViewRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    usageDataProvider: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    counterReports: PropTypes.shape(),
    harvesterImpls: PropTypes.shape(),
    query: PropTypes.object,
    settings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    usageDataProvider: PropTypes.shape(),
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.shape().isRequired,
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
};

UDPViewRoute.defaultProps = {
  handlers: {},
};

UDPViewRoute.manifest = Object.freeze({
  usageDataProvider: {
    type: 'okapi',
    path: 'usage-data-providers/:{id}?unused=%{udpReloadToggle}',
  },
  harvesterImpls: {
    type: 'okapi',
    path: 'erm-usage-harvester/impl?aggregator=false',
    throwErrors: false,
  },
  settings: {
    type: 'okapi',
    records: 'configs',
    path:
      'configurations/entries?query=(module==ERM-USAGE and configName==hide_credentials)',
  },
  counterReports: {
    type: 'okapi',
    path: 'counter-reports/sorted/:{id}?unused=%{statsReloadToggle}&limit=1000',
  },
  customReports: {
    type: 'okapi',
    path:
      'custom-reports?unused=%{statsReloadToggle}&query=(providerId=:{id})&limit=1000',
  },
  statsReloadToggle: {
    // We mutate this when we update a report, to force a stripes-connect reload.
    // Thanks to Mike Taylor in ui-courses (https://github.com/folio-org/ui-courses/blame/a8dcccfd58e89e102f6fad1e95b52dbe89947e0b/src/routes/CourseRoute.js#L36)
    initialValue: 0,
  },
  udpReloadToggle: {
    // We mutate this when we update a report, to force a stripes-connect reload.
    // Thanks to Mike Taylor.
    initialValue: 0,
  },
  query: {},
});

export default compose(
  withReportHandlers,
  stripesConnect,
  withTags
)(UDPViewRoute);
