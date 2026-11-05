import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import {
  API_HARVESTER_PERIODIC,
  QK_HARVESTER_PERIODIC,
} from '../constants';

const queryKey = [QK_HARVESTER_PERIODIC];

const usePeriodicConfig = () => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const createErrorFromResponse = (response, intlTag) => new Error(
    formatMessage(
      { id: `ui-erm-usage.settings.harvester.config.periodic.${intlTag}.fail` },
      {
        status: response.status,
        statusText: response.statusText,
      }
    )
  );

  const { data, error, isLoading } = useOkapiKyQuery({
    queryKey,
    api: API_HARVESTER_PERIODIC,
    // fetch the config every time the settings are opened, but not again while they are open
    options: { cacheTime: 0, refetchOnReconnect: false },
  });

  const notFound = error?.response?.status === 404;
  const translateError = (err, intlTag) => (err.response ? createErrorFromResponse(err.response, intlTag) : err);

  const fetchError = useMemo(
    () => (error && !notFound ? translateError(error, 'fetch') : undefined),
    [error] // eslint-disable-line react-hooks/exhaustive-deps
  );

  let config;

  if (!isLoading) {
    config = error ? {} : (data ?? {});
  }

  const { useCreate, useDelete } = useOkapiKyMutation({
    mutationKey: QK_HARVESTER_PERIODIC,
    api: API_HARVESTER_PERIODIC,
  });

  const { mutateAsync: createConfig } = useCreate({
    onSuccess: (_, periodicConfig) => {
      queryClient.setQueryData(queryKey, (prevConfig) => ({ ...prevConfig, ...periodicConfig }));
    },
  });

  const { mutateAsync: removeConfig } = useDelete({
    withoutId: true,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, {});
    },
  });

  const saveConfig = (periodicConfig) => createConfig(periodicConfig)
    .catch((err) => {
      throw translateError(err, 'save');
    });

  const deleteConfig = () => removeConfig()
    .catch((err) => {
      throw translateError(err, 'delete');
    });

  return {
    config,
    fetchError,
    saveConfig,
    deleteConfig,
  };
};

export default usePeriodicConfig;
