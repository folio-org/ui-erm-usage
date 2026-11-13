import PropTypes from 'prop-types';

import {
  NoPermissionMessage,
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { LoadingPane } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import UDPForm from '../components/views/UDPForm';
import {
  API_HARVESTER_IMPL,
  API_UDPS,
  KEY_HARVESTER_IMPL,
  KEY_UDPS,
} from '../util/constants';
import urls from '../util/urls';

const UDPEditRoute = ({
  handlers = {},
  history,
  location,
  match,
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.edit');
  const id = match.params.id;

  const handleClose = () => {
    history.push(`${urls.udpView(id)}${location.search}`);
  };

  const { data: harvesterImplsData, isLoading: isHarvesterImplsLoading } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_IMPL],
    api: API_HARVESTER_IMPL,
  });

  const { data: udpData, isLoading: isUdpLoading } = useOkapiKyQuery({
    queryKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { useUpdate } = useOkapiKyMutation({
    mutationKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { mutateAsync: updateUdp } = useUpdate({
    onSuccess: () => {
      history.push(`${urls.udpView(id)}${location.search}`);
    },
  });

  const harvesterImpls = harvesterImplsData ? [harvesterImplsData] : [];
  const udp = udpData ?? {};
  const isLoading = isHarvesterImplsLoading || isUdpLoading;

  if (!hasPerms) return <NoPermissionMessage />;

  if (isLoading) {
    return <LoadingPane dismissible onClose={handleClose} />;
  }

  return (
    <UDPForm
      data={{ harvesterImpls }}
      handlers={{
        ...handlers,
        onClose: handleClose,
      }}
      initialValues={udp}
      isLoading={isLoading}
      onSubmit={updateUdp}
      store={stripes.store}
    />
  );
};

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
};

export default UDPEditRoute;
