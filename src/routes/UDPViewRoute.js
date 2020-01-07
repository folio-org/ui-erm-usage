import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import UDP from '../components/views/UDP';

import urls from '../util/urls';
import extractHarvesterImpls from '../util/harvesterImpls';

class UDPViewRoute extends React.Component {
  static manifest = Object.freeze({
    usageDataProvider: {
      type: 'okapi',
      path: 'usage-data-providers/:{id}'
    },
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false',
      throwErrors: false
    },
    settings: {
      type: 'okapi',
      records: 'configs',
      path:
        'configurations/entries?query=(module==ERM-USAGE and configName==hide_credentials)'
    },
    counterReports: {
      type: 'okapi',
      path: 'counter-reports?tiny=true&query=(providerId==:{id})&limit=1000'
    },
    query: {}
  });

  handleClose = () => {
    this.props.history.push(`${urls.udps()}${this.props.location.search}`);
  };

  handleEdit = () => {
    const { location, match } = this.props;
    this.props.history.push(
      `${urls.udpEdit(match.params.id)}${location.search}`
    );
  };

  getRecord = id => {
    return get(this.props.resources, 'usageDataProvider.records', []).find(
      i => i.id === id
    );
  };

  getCounterReports = udpId => {
    const { resources } = this.props;
    const records = (resources.counterReports || {}).records || null;
    const counterReports = !isEmpty(records) ? records[0].counterReports : [];
    if (!isEmpty(counterReports) && counterReports[0].providerId === udpId) {
      return counterReports;
    } else {
      return [];
    }
  };

  isLoading = () => {
    const { match, resources } = this.props;

    return (
      match.params.id !== get(resources, 'usageDataProvider.records[0].id') &&
      get(resources, 'usageDataProvider.isPending', true)
    );
  };

  isHarvesterExistent = () => {
    return this.props.stripes.hasInterface('erm-usage-harvester');
  };

  render() {
    const {
      handlers,
      resources,
      stripes,
      tagsEnabled,
      match: {
        params: { id }
      }
    } = this.props;
    const selectedRecord = this.getRecord(id);
    const counterReports = this.getCounterReports(id);
    const settings = get(resources, 'settings.records', []);
    const harvesterImpls = extractHarvesterImpls(resources);

    return (
      <UDP
        canEdit={stripes.hasPerm('usagedataproviders.item.put')}
        data={{
          counterReports,
          harvesterImpls,
          settings,
          usageDataProvider: selectedRecord
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          onEdit: this.handleEdit,
        }}
        isHarvesterExistent={this.isHarvesterExistent()}
        isLoading={this.isLoading()}
        stripes={stripes}
        tagsEnabled={tagsEnabled}
      />
    );
  }
}

UDPViewRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired
    }).isRequired,
    usageDataProvider: PropTypes.object.isRequired
  }).isRequired,
  resources: PropTypes.shape({
    counterReports: PropTypes.shape(),
    harvesterImpls: PropTypes.shape(),
    query: PropTypes.object,
    settings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object)
    }),
    usageDataProvider: PropTypes.shape()
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  tagsEnabled: PropTypes.bool
};

UDPViewRoute.defaultProps = {
  handlers: {}
};

export default stripesConnect(withTags(UDPViewRoute));
