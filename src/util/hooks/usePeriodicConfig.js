import { useStripes } from '@folio/stripes-core';
import { useIntl } from 'react-intl';
import createOkapiHeaders from '../createOkapiHeaders';

const usePeriodicConfig = () => {
  const path = '/erm-usage-harvester/periodic';
  const { formatMessage } = useIntl();
  const { okapi } = useStripes();

  const okapiUrl = okapi.url;
  const headers = {
    ...createOkapiHeaders(okapi),
  };

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
    return fetch(okapiUrl + path, {
      headers,
      credentials: 'include',
      method: 'GET',
    }).then((response) => {
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
    return fetch(okapiUrl + path, {
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
      credentials: 'include',
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
    return fetch(okapiUrl + path, {
      headers,
      credentials: 'include',
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
