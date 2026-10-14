import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

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

  return { fetchConfig, saveConfig };
};

export default usePeriodicConfig;
