import { useState } from 'react';

const useServiceStatus = (url) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].Service_Active !== undefined) {
        setStatus(data[0].Service_Active);
      } else {
        setError('Invalid response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    fetchStatus,
    isLoading,
    status,
  };
};

export default useServiceStatus;
