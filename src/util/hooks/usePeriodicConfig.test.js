import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import periodicConfig from '../../../test/fixtures/periodicConfig';
import Intl from '../../../test/jest/__mock__/intl.mock';
import {
  API_HARVESTER_PERIODIC,
  QK_HARVESTER_PERIODIC,
} from '../constants';
import usePeriodicConfig from './usePeriodicConfig';

jest.mock('@folio/stripes-leipzig-components', () => ({
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
}));

const queryKey = [QK_HARVESTER_PERIODIC];

// errors as thrown by ky: HTTP errors carry the response, other errors (e.g. network failures) do not
const httpError = (status, statusText) => Object.assign(new Error(statusText), { response: { status, statusText } });
const serverError = httpError(500, 'Internal Server Error');
const networkError = new TypeError('Failed to fetch');

describe('usePeriodicConfig', () => {
  let queryClient;
  let createRequest;
  let deleteRequest;
  let deleteOptions;

  // the mutation hooks call onSuccess like react-query does
  const mutation = (request, options) => ({
    mutateAsync: (variables) => request(variables).then((data) => {
      options?.onSuccess?.(data, variables);
      return data;
    }),
  });

  const mockQuery = ({ data, error, isLoading = false } = {}) => {
    useOkapiKyQuery.mockReturnValue({ data, error, isLoading });
  };

  const renderUsePeriodicConfig = () => {
    const wrapper = ({ children }) => (
      <Intl>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Intl>
    );

    return renderHook(() => usePeriodicConfig(), { wrapper });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
    createRequest = jest.fn().mockResolvedValue(null);
    deleteRequest = jest.fn().mockResolvedValue(null);

    useOkapiKyMutation.mockReturnValue({
      useCreate: (options) => mutation(createRequest, options),
      useDelete: (options) => {
        deleteOptions = options;
        return mutation(deleteRequest, options);
      },
    });
  });

  describe('fetching', () => {
    it('should query the periodic config endpoint', () => {
      mockQuery({ data: periodicConfig });
      renderUsePeriodicConfig();

      expect(useOkapiKyQuery).toHaveBeenCalledWith({
        queryKey,
        api: API_HARVESTER_PERIODIC,
        options: { cacheTime: 0, refetchOnReconnect: false },
      });
      expect(useOkapiKyMutation).toHaveBeenCalledWith({
        mutationKey: QK_HARVESTER_PERIODIC,
        api: API_HARVESTER_PERIODIC,
      });
    });

    it('should have no config while fetching', () => {
      mockQuery({ isLoading: true });
      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toBeUndefined();
    });

    it('should return the fetched config', () => {
      mockQuery({ data: periodicConfig });
      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toEqual(periodicConfig);
      expect(result.current.fetchError).toBeUndefined();
    });

    it('should return an empty config without an error if none exists', () => {
      mockQuery({ error: httpError(404, 'Not Found') });
      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toEqual({});
      expect(result.current.fetchError).toBeUndefined();
    });

    it('should return an empty config and a translated error if the server fails', () => {
      mockQuery({ error: serverError });
      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toEqual({});
      expect(result.current.fetchError.message).toBe(
        "Received '500 - Internal Server Error' while fetching periodic harvesting configuration"
      );
    });

    it('should pass network errors through', () => {
      mockQuery({ error: networkError });
      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toEqual({});
      expect(result.current.fetchError).toBe(networkError);
    });
  });

  describe('saving', () => {
    const data = { startAt: '2026-10-21T08:00:00+0000', periodicInterval: 'monthly' };

    it('should post the config and merge it into the fetched one', async () => {
      mockQuery({ data: periodicConfig });
      queryClient.setQueryData(queryKey, periodicConfig);
      const { result } = renderUsePeriodicConfig();

      await act(() => result.current.saveConfig(data));

      expect(createRequest).toHaveBeenCalledWith(data);
      expect(queryClient.getQueryData(queryKey)).toEqual({ ...periodicConfig, ...data });
    });

    it('should set the config if none exists', async () => {
      mockQuery({ error: httpError(404, 'Not Found') });
      const { result } = renderUsePeriodicConfig();

      await act(() => result.current.saveConfig(data));

      expect(queryClient.getQueryData(queryKey)).toEqual(data);
    });

    it('should reject with a translated error if the server fails', async () => {
      mockQuery({ data: periodicConfig });
      queryClient.setQueryData(queryKey, periodicConfig);
      createRequest.mockRejectedValue(serverError);
      const { result } = renderUsePeriodicConfig();

      await expect(result.current.saveConfig(data)).rejects.toThrow(
        "Received '500 - Internal Server Error' while saving periodic harvesting configuration"
      );
      expect(queryClient.getQueryData(queryKey)).toEqual(periodicConfig);
    });

    it('should pass network errors through', async () => {
      mockQuery({ data: periodicConfig });
      createRequest.mockRejectedValue(networkError);
      const { result } = renderUsePeriodicConfig();

      await expect(result.current.saveConfig(data)).rejects.toBe(networkError);
    });
  });

  describe('deleting', () => {
    it('should delete the config without an id and clear it', async () => {
      mockQuery({ data: periodicConfig });
      queryClient.setQueryData(queryKey, periodicConfig);
      const { result } = renderUsePeriodicConfig();

      await act(() => result.current.deleteConfig());

      expect(deleteOptions.withoutId).toBe(true);
      expect(deleteRequest).toHaveBeenCalled();
      expect(queryClient.getQueryData(queryKey)).toEqual({});
    });

    it('should reject with a translated error if the server fails', async () => {
      mockQuery({ data: periodicConfig });
      queryClient.setQueryData(queryKey, periodicConfig);
      deleteRequest.mockRejectedValue(serverError);
      const { result } = renderUsePeriodicConfig();

      await expect(result.current.deleteConfig()).rejects.toThrow(
        "Received '500 - Internal Server Error' while deleting periodic harvesting configuration"
      );
      expect(queryClient.getQueryData(queryKey)).toEqual(periodicConfig);
    });

    it('should pass network errors through', async () => {
      mockQuery({ data: periodicConfig });
      deleteRequest.mockRejectedValue(networkError);
      const { result } = renderUsePeriodicConfig();

      await expect(result.current.deleteConfig()).rejects.toBe(networkError);
    });
  });
});
