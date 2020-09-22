import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import compose from 'compose-function';
import { get, isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Callout } from '@folio/stripes-components';
import { withTags } from '@folio/stripes/smart-components';

import UDP from '../components/views/UDP';
import urls from '../util/urls';
import extractHarvesterImpls from '../util/harvesterImpls';
import { downloadReportMultipleMonths } from '../util/downloadReport';

function UDPViewRoute(props) {
  const calloutRef = useRef();

  const handleClose = () => {
    props.history.push(`${urls.udps()}${props.location.search}`);
  };

  const handleEdit = () => {
    const { location, match } = props;
    props.history.push(`${urls.udpEdit(match.params.id)}${location.search}`);
  };

  const getRecord = (id) => {
    return get(props.resources, 'usageDataProvider.records', []).find(
      (i) => i.id === id
    );
  };

  const getCounterReports = (udpId) => {
    const { resources } = props;
    const records = (resources.counterReports || {}).records || null;
    const counterReports = !isEmpty(records)
      ? records[0].counterReportsPerYear
      : [];
    if (
      !isEmpty(counterReports) &&
      counterReports[0].reportsPerType[0].counterReports[0].providerId === udpId
    ) {
      return counterReports;
    } else {
      return [];
    }
  };

  const getCustomReports = (udpId) => {
    const { resources } = props;
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
    const { match, resources } = props;

    return (
      match.params.id !== get(resources, 'usageDataProvider.records[0].id') &&
      get(resources, 'usageDataProvider.isPending', true)
    );
  };

  const isStatsLoading = () => {
    const { resources } = props;
    return (
      get(resources, 'customReports.isPending', true) ||
      get(resources, 'counterReports.isPending', true)
    );
  };

  const isHarvesterExistent = () => {
    return props.stripes.hasInterface('erm-usage-harvester');
  };

  const doDownloadReportsMultiMonths = (
    udpId,
    reportType,
    counterVersion,
    start,
    end,
    format
  ) => {
    const httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': props.stripes.okapi.tenant,
        'X-Okapi-Token': props.stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      }
    );
    downloadReportMultipleMonths(
      udpId,
      reportType,
      counterVersion,
      start,
      end,
      format,
      props.stripes.okapi.url,
      httpHeaders,
      calloutRef,
      props.intl
    );
  };

  const {
    handlers,
    resources,
    stripes,
    tagsEnabled,
    match: {
      params: { id },
    },
  } = props;
  const selectedRecord = getRecord(id);
  const counterReports = getCounterReports(id);
  const customReports = getCustomReports(id);
  const settings = get(resources, 'settings.records', []);
  const harvesterImpls = extractHarvesterImpls(resources);
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
          onDownloadReportMultiMonth: doDownloadReportsMultiMonths,
        }}
        isHarvesterExistent={isHarvesterExistent()}
        isLoading={isLoading()}
        isStatsLoading={isStatsLoading()}
        stripes={stripes}
        tagsEnabled={tagsEnabled}
      />
      <Callout ref={calloutRef} />
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
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
  intl: PropTypes.object,
};

UDPViewRoute.defaultProps = {
  handlers: {},
};

UDPViewRoute.manifest = Object.freeze({
  usageDataProvider: {
    type: 'okapi',
    path: 'usage-data-providers/:{id}',
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
    path: 'counter-reports/sorted/:{id}?limit=1000',
  },
  customReports: {
    type: 'okapi',
    path: 'custom-reports?query=(providerId=:{id})&limit=1000',
  },
  query: {},
});

export default compose(stripesConnect, withTags, injectIntl)(UDPViewRoute);
