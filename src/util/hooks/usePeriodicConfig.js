import { useStripes } from '@folio/stripes-core';
import { useIntl } from 'react-intl';

const usePeriodicConfig = () => {
  const path = '/erm-usage-harvester/periodic';
  const { formatMessage } = useIntl();
  const { okapi } = useStripes();

  const okapiUrl = okapi.url;
  const headers = {
    'X-Okapi-Tenant': okapi.tenant,
    'X-Okapi-Token': okapi.token,
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
