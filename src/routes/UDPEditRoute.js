import { FORM_ERROR } from 'final-form';
import PropTypes from 'prop-types';
import {
  useContext,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  NoPermissionMessage,
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { LoadingPane } from '@folio/stripes/components';
import {
  CalloutContext,
  useStripes,
} from '@folio/stripes/core';

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
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const callout = useContext(CalloutContext);

  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.edit');
  const id = match.params.id;

  const showErrorInfo = (error) => {
    const errorMessage = error?.message || formatMessage({ id: 'ui-erm-usage.general.error' });
    const prefix = formatMessage({ id: 'ui-erm-usage.general.error2' });

    callout?.sendCallout?.({
      type: 'error',
      message: `${prefix}: ${errorMessage}`,
      timeout: 0,
    });

    return errorMessage;
  };

  const handleSubmitError = (error) => ({
    [FORM_ERROR]: showErrorInfo(error),
  });

  const handleClose = () => {
    history.push(`${urls.udpView(id)}${location.search}`);
  };

  const {
    data: harvesterImplsData,
    isLoading: isHarvesterImplsLoading,
    error: harvesterImplsError,
  } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_IMPL],
    api: API_HARVESTER_IMPL,
  });

  const {
    data: udpData,
    isLoading: isUdpLoading,
    error: udpError,
  } = useOkapiKyQuery({
    queryKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  useEffect(() => {
    if (harvesterImplsError) showErrorInfo(harvesterImplsError);
    if (udpError) showErrorInfo(udpError);
  }, [harvesterImplsError, udpError]); // eslint-disable-line react-hooks/exhaustive-deps

  const { useUpdate } = useOkapiKyMutation({
    mutationKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { mutateAsync: updateUdp } = useUpdate({
    onSuccess: async () => {
      await queryClient.invalidateQueries([KEY_UDPS, id]);

      history.push(`${urls.udpView(id)}${location.search}`);
    },
  });

  const handleSubmit = async (values) => {
    try {
      await updateUdp(values);
      return undefined;
    } catch (error) {
      return handleSubmitError(error);
    }
  };

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
      onSubmit={handleSubmit}
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
