import { useQuery } from 'react-query';
import ky from 'ky';

const useServiceStatus = (url) => {
  const { data, error, isLoading, refetch } = useQuery(
    ['serviceStatus', url],
    async () => {
      const response = await ky.get(url, { credentials: 'omit' }).json();
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
