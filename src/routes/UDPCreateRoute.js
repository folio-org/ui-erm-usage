import { FORM_ERROR } from 'final-form';
import PropTypes from 'prop-types';
import {
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

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

const UDPCreateRoute = ({
  handlers = {},
  history,
  location,
}) => {
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-erm-usage.udp.create');
  const callout = useContext(CalloutContext);
  const { formatMessage } = useIntl();

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
    history.push(`${urls.udps()}${location.search}`);
  };

  const { useCreate } = useOkapiKyMutation({
    mutationKey: [KEY_UDPS],
    api: API_UDPS,
  });

  const { mutateAsync: createUdp } = useCreate({
    onSuccess: (createdUdp) => {
      history.push(`${urls.udpView(createdUdp.id)}${location.search}`);
    },
  });

  const handleSubmit = async values => {
    try {
      await createUdp(values);
      return undefined;
    } catch (error) {
      showErrorInfo(error);
      return handleSubmitError(error);
    }
  };

  const {
    data: harvesterImplsData,
    error: harvesterImplsError,
    isLoading: isHarvesterImplsLoading,
  } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_IMPL],
    api: API_HARVESTER_IMPL,
  });

  useEffect(() => {
    if (hasPerms && harvesterImplsError) {
      showErrorInfo(harvesterImplsError);
    }
  }, [hasPerms, harvesterImplsError]); // eslint-disable-line react-hooks/exhaustive-deps

  const harvesterImpls = harvesterImplsData ? [harvesterImplsData] : [];
  const implList = harvesterImpls[0]?.implementations ?? [];
  const defaultImpl = implList.find(i => i.isDefault) ?? implList[0];

  const initialValues = useMemo(() => ({
    status: 'active',
    harvestingConfig: {
      harvestingStatus: 'active',
      reportRelease: defaultImpl?.reportRelease,
      sushiConfig: { serviceType: defaultImpl?.type },
    },
  }), [defaultImpl]);

  if (!hasPerms) return <NoPermissionMessage />;

  if (isHarvesterImplsLoading) {
    return <LoadingPane dismissible onClose={handleClose} />;
  }

  if (harvesterImplsError) return null;

  return (
    <UDPForm
      data={{ harvesterImpls }}
      handlers={{
        ...handlers,
        onClose: handleClose,
      }}
      initialValues={initialValues}
      isLoading={isHarvesterImplsLoading}
      onSubmit={handleSubmit}
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
};

export default UDPCreateRoute;
