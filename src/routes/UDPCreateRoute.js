import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';

import UDPForm from '../components/views/UDPForm';
import extractHarvesterImpls from '../util/harvesterImpls';

import urls from '../util/urls';

const UDPCreateRoute = ({
  handlers = {},
  history,
  location,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.create');

  const handleClose = () => {
    history.push(`${urls.udps()}${location.search}`);
  };

  const handleSubmit = (udp) => {
    mutator.usageDataProviders.POST(udp).then(({ id }) => {
      history.push(`${urls.udpView(id)}${location.search}`);
    });
  };

  const fetchIsPending = () => {
    return Object.values(resources)
      .filter((r) => r && r.resource !== 'usageDataProviders')
      .some((r) => r.isPending);
  };

  const harvesterImpls = extractHarvesterImpls(resources);
  const aggregators = (resources.aggregators || {}).records || [];

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
      }}
      initialValues={{ harvestingConfig: { harvestingStatus: 'active', harvestVia: 'sushi', reportRelease: '5', sushiConfig: { serviceType: 'cs50' } } }}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
      store={stripes.store}
    />
  );
};

UDPCreateRoute.manifest = Object.freeze({
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
  usageDataProviders: {
    type: 'okapi',
    path: 'usage-data-providers',
    fetch: false,
    shouldRefresh: () => false,
  },
});

UDPCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProviders: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
  }),
  resources: PropTypes.shape({
    aggregators: PropTypes.object,
    harvesterImpls: PropTypes.object,
    usageDataProviders: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(UDPCreateRoute);
