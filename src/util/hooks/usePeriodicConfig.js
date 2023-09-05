import { useStripes } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import fetchWithDefaultOptions from '../fetchWithDefaultOptions';

const usePeriodicConfig = () => {
  const path = '/erm-usage-harvester/periodic';
  const { formatMessage } = useIntl();
  const { okapi } = useStripes();

  const createErrorFromResponse = (response, intlTag) => new Error(
    formatMessage(
      { id: `ui-erm-usage.settings.harvester.config.periodic.${intlTag}.fail` },
      {
        status: response.status,
        statusText: response.statusText,
      }
    )
  );

  const fetchConfig = () => {
    return fetchWithDefaultOptions(okapi, path).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        return {};
      } else {
        throw createErrorFromResponse(response, 'fetch');
      }
    });
  };

  const saveConfig = (periodicConfig) => {
    return fetchWithDefaultOptions(okapi, path, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(periodicConfig),
    }).then((response) => {
      if (response.status === 201) {
        return response;
      } else {
        throw createErrorFromResponse(response, 'save');
      }
    });
  };

  const deleteConfig = () => {
    return fetchWithDefaultOptions(okapi, path, {
      method: 'DELETE',
    }).then((response) => {
      if (response.status === 204) {
        return response;
      } else {
        throw createErrorFromResponse(response, 'delete');
      }
    });
  };

  return { fetchConfig, saveConfig, deleteConfig };
};

export default usePeriodicConfig;
