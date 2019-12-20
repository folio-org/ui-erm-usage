import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-erm-components';

import UDPForm from '../components/views/UDPForm';
import extractHarvesterImpls from '../util/HarvesterImpls';

import urls from '../components/utilities';

class UDPEditRoute extends React.Component {
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
    usageDataProvider: {
      type: 'okapi',
      path: 'usage-data-providers/:{id}',
      shouldRefresh: () => false
    }
  });

  static defaultProps = {
    handlers: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('usagedataproviders.item.put')
    };
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(
      `${urls.udpView(match.params.id)}${location.search}`
    );
  };

  handleSubmit = udp => {
    const { history, location, mutator } = this.props;

    mutator.usageDataProvider.PUT(udp).then(({ id }) => {
      history.push(`${urls.udpView(id)}${location.search}`);
    });
  };

  handleDelete = id => {
    const { history, location, mutator } = this.props;
    mutator.usageDataProvider.DELETE({ id }).then(() => {
      history.push(`${urls.udps()}${location.search}`);
    });
  };

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'usageDataProvider')
      .some(r => r.isPending);
  };

  render() {
    const { handlers, resources, stripes } = this.props;
    const harvesterImpls = extractHarvesterImpls(resources);
    const aggregators = (resources.aggregators || {}).records || [];
    const udp = get(resources, 'usageDataProvider.records[0]', {});

    if (!this.state.hasPerms) return <div>No Permission</div>;
    if (this.fetchIsPending()) return <LoadingPane onClose={this.handleClose} renderPaneset />;

    return (
      <UDPForm
        data={{
          aggregators,
          harvesterImpls
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          onDelete: this.handleDelete,
        }}
        initialValues={udp}
        isLoading={this.fetchIsPending()}
        onSubmit={this.handleSubmit}
        store={stripes.store}
      />
    );
  }
}

UDPEditRoute.propTypes = {
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
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProvider: PropTypes.shape({
      POST: PropTypes.func.isRequired
    }).isRequired
  }),
  resources: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProvider: PropTypes.object
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired
  }).isRequired
};

export default stripesConnect(UDPEditRoute);
