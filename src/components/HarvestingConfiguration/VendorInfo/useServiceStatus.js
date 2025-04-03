import { useQuery } from 'react-query';
import ky from 'ky';

import { CS51 } from '../../../util/constants';

const useServiceStatus = (url, serviceType) => {
  const checkURL = `${url}${serviceType === CS51 ? '/r51' : ''}/status`;
  const { data, error, isLoading, refetch } = useQuery(
    ['serviceStatus', checkURL],
    async () => {
      const response = await ky.get(checkURL, { credentials: 'omit' }).json();
      if (Array.isArray(response) && response.length > 0 && response[0].Service_Active !== undefined) {
        return response[0].Service_Active;
      }
      throw new Error('Invalid response');
    },
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    status: data,
    error,
    isLoading,
    fetchStatus: refetch,
  };
};

export default useServiceStatus;
