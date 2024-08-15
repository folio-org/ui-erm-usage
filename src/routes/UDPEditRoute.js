import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';

import UDPForm from '../components/views/UDPForm';
import extractHarvesterImpls from '../util/harvesterImpls';
import urls from '../util/urls';

const UDPEditRoute = ({
  handlers = {},
  history,
  location,
  match,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.edit');

  const handleClose = () => {
    history.push(
      `${urls.udpView(match.params.id)}${location.search}`
    );
  };

  const handleSubmit = (udp) => {
    mutator.usageDataProvider.PUT(udp).then(({ id }) => {
      history.push(`${urls.udpView(id)}${location.search}`);
    });
  };

  const handleDelete = (id) => {
    mutator.usageDataProvider.DELETE({ id }).then(() => {
      history.push(`${urls.udps()}${location.search}`);
    });
  };

  const fetchIsPending = () => {
    return Object.values(resources)
      .filter((r) => r && r.resource !== 'usageDataProvider')
      .some((r) => r.isPending);
  };

  const harvesterImpls = extractHarvesterImpls(resources);
  const aggregators = (resources.aggregators || {}).records || [];
  const udp = get(resources, 'usageDataProvider.records[0]', {});

  if (!hasPerms) return <div>No Permission</div>;
  if (fetchIsPending()) {
    return <LoadingPane onClose={handleClose} />;
  }
  return (
    <UDPForm
      data={{
        aggregators,
        harvesterImpls,
      }}
      handlers={{
        ...handlers,
        onClose: handleClose,
        onDelete: handleDelete,
      }}
      initialValues={udp}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
      store={stripes.store}
    />
  );
};

UDPEditRoute.manifest = Object.freeze({
  aggregators: {
    type: 'okapi',
    path: 'aggregator-settings',
    shouldRefresh: () => false,
  },
  harvesterImpls: {
    type: 'okapi',
    path: 'erm-usage-harvester/impl?aggregator=false',
    shouldRefresh: () => false,
  },
  usageDataProvider: {
    type: 'okapi',
    path: 'usage-data-providers/:{id}',
    shouldRefresh: () => false,
  },
});

UDPEditRoute.propTypes = {
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
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProvider: PropTypes.shape({
      DELETE: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }),
  resources: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProvider: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(UDPEditRoute);
