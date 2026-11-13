import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  NoPermissionMessage,
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { LoadingPane } from '@folio/stripes/components';

import UDPForm from '../components/views/UDPForm';
import {
  API_HARVESTER_IMPL,
  API_UDPS,
  KEY_HARVESTER_IMPL,
  KEY_UDPS,
} from '../util/constants';
import urls from '../util/urls';

const UDPCreateRoute = ({
  handlers = {},
  history,
  location,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.create');

  const handleClose = () => {
    history.push(`${urls.udps()}${location.search}`);
  };

  const id = useMemo(() => uuidv4(), []);
  const { useCreate } = useOkapiKyMutation({
    mutationKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { mutateAsync: createUdp } = useCreate({
    onSuccess: () => {
      history.push(`${urls.udpView(id)}${location.search}`);
    },
  });

  const { data: harvesterImplsData, isLoading: isHarvesterImplsLoading } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_IMPL],
    api: API_HARVESTER_IMPL,
  });

  const harvesterImpls = harvesterImplsData ?? [];
  const implList = harvesterImpls[0]?.implementations ?? [];
  const defaultImpl = implList.find(i => i.isDefault) ?? implList[0];

  if (!hasPerms) return <NoPermissionMessage />;

  if (isHarvesterImplsLoading) {
    return <LoadingPane dismissible onClose={handleClose} />;
  }

  return (
    <UDPForm
      data={{ harvesterImpls }}
      handlers={{
        ...handlers,
        onClose: handleClose,
      }}
      initialValues={{
        status: 'active',
        harvestingConfig: {
          harvestingStatus: 'active',
          reportRelease: defaultImpl?.reportRelease,
          sushiConfig: { serviceType: defaultImpl?.type },
        },
      }}
      isLoading={isHarvesterImplsLoading}
      onSubmit={createUdp}
      store={stripes.store}
    />
  );
};

UDPCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
};

export default UDPCreateRoute;
