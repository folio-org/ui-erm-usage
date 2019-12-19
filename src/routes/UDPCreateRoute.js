import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-erm-components';

import UDPForm from '../components/views/UDPForm';
import extractHarvesterImpls from '../util/HarvesterImpls';

import { urls } from '../components/utilities';

class UDPCreateRoute extends React.Component {
  static manifest = Object.freeze({
    aggregators: {
      type: 'okapi',
      path: 'aggregator-settings',
      shouldRefresh: () => false
    },
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false',
      shouldRefresh: () => false
    },
    usageDataProviders: {
      type: 'okapi',
      path: 'usage-data-providers',
      fetch: false,
      shouldRefresh: () => false
    }
  });

  static defaultProps = {
    handlers: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('usagedataproviders.item.post'),
    };
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.udps()}${location.search}`);
  }

  handleSubmit = (udp) => {
    const { history, location, mutator } = this.props;

    mutator.usageDataProviders
      .POST(udp)
      .then(({ id }) => {
        history.push(`${urls.udpView(id)}${location.search}`);
      });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'usageDataProviders')
      .some(r => r.isPending);
  }

  render() {
    const { handlers, resources, stripes } = this.props;
    const harvesterImpls = extractHarvesterImpls(resources);
    const aggregators = (resources.aggregators || {}).records || [];

    if (!this.state.hasPerms) return <div>No Permission</div>;
    if (this.fetchIsPending()) return <LoadingPane onClose={this.handleClose} renderPaneset />;

    return (
      <UDPForm
        data={{
          aggregators,
          harvesterImpls,
        }}
        handlers={{
          ...handlers
        }}
        isLoading={this.fetchIsPending()}
        onSubmit={this.handleSubmit}
        store={stripes.store}
      />
    );
  }
}

UDPCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  mutator: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProviders: PropTypes.shape({
      POST: PropTypes.func.isRequired
    }).isRequired,
  }),
  resources: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProviders: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired
  }).isRequired,
};

export default stripesConnect(UDPCreateRoute);
