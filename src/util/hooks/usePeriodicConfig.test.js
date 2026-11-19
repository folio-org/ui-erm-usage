import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import periodicConfig from '../../../test/fixtures/periodicConfig';
import Intl from '../../../test/jest/__mock__/intl.mock';
import {
  API_HARVESTER_PERIODIC,
  KEY_HARVESTER_PERIODIC,
} from '../constants';
import usePeriodicConfig from './usePeriodicConfig';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryKey = [KEY_HARVESTER_PERIODIC];

// errors as thrown by ky: HTTP errors carry the response, other errors (e.g. network failures) do not
const httpError = (status, statusText) => Object.assign(new Error(statusText), { response: { status, statusText } });
const serverError = httpError(500, 'Internal Server Error');
const networkError = new TypeError('Failed to fetch');

describe('usePeriodicConfig', () => {
  let queryClient;
  let ky;

  const mockGet = (promise) => {
    ky.get.mockReturnValue({
      json: jest.fn(() => promise),
    });
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

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    ky = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    useOkapiKy.mockReturnValue(ky);
    mockGet(Promise.resolve(periodicConfig));
  });

  describe('fetching', () => {
    it('should query the periodic config endpoint', async () => {
      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      expect(ky.get).toHaveBeenCalledWith(API_HARVESTER_PERIODIC, {
        searchParams: {},
      });
    });

    it('should have no config while fetching', () => {
      mockGet(new Promise(() => {}));

      const { result } = renderUsePeriodicConfig();

      expect(result.current.config).toBeUndefined();
    });

    it('should return the fetched config', async () => {
      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      expect(result.current.fetchError).toBeUndefined();
    });

    it('should return an empty config without an error if none exists', async () => {
      mockGet(Promise.reject(httpError(404, 'Not Found')));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual({});
      });

      expect(result.current.fetchError).toBeUndefined();
    });

    it('should return an empty config and a translated error if the server fails', async () => {
      mockGet(Promise.reject(serverError));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.fetchError?.message).toBe(
          "Received '500 - Internal Server Error' while fetching periodic harvesting configuration"
        );
      });

      expect(result.current.config).toEqual({});
    });

    it('should pass network errors through', async () => {
      mockGet(Promise.reject(networkError));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.fetchError).toBe(networkError);
      });

      expect(result.current.config).toEqual({});
    });
  });

  describe('saving', () => {
    const data = { startAt: '2026-10-21T08:00:00+0000', periodicInterval: 'monthly' };

    it('should post the config and merge it into the fetched one', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.post.mockResolvedValue(new Response(null, { status: 204 }));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      await result.current.saveConfig(data);

      expect(ky.post).toHaveBeenCalledWith(API_HARVESTER_PERIODIC, {
        json: data,
      });
      expect(queryClient.getQueryData(queryKey)).toEqual({ ...periodicConfig, ...data });
    });

    it('should set the config if none exists', async () => {
      mockGet(Promise.reject(httpError(404, 'Not Found')));
      ky.post.mockResolvedValue(new Response(null, { status: 204 }));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual({});
      });

      await result.current.saveConfig(data);

      expect(queryClient.getQueryData(queryKey)).toEqual(data);
    });

    it('should reject with a translated error if the server fails', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.post.mockRejectedValue(serverError);

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      await expect(result.current.saveConfig(data)).rejects.toThrow(
        "Received '500 - Internal Server Error' while saving periodic harvesting configuration"
      );

      expect(queryClient.getQueryData(queryKey)).toEqual(periodicConfig);
    });

    it('should pass network errors through', async () => {
      ky.post.mockRejectedValue(networkError);

      const { result } = renderUsePeriodicConfig();

      await expect(result.current.saveConfig(data)).rejects.toBe(networkError);
    });
  });

  describe('deleting', () => {
    it('should delete the config without an id and clear it', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.delete.mockResolvedValue(new Response(null, { status: 204 }));

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      await result.current.deleteConfig();

      expect(ky.delete).toHaveBeenCalledWith(API_HARVESTER_PERIODIC, {});
      expect(queryClient.getQueryData(queryKey)).toEqual({});
    });

    it('should reject with a translated error if the server fails', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.delete.mockRejectedValue(serverError);

      const { result } = renderUsePeriodicConfig();

      await waitFor(() => {
        expect(result.current.config).toEqual(periodicConfig);
      });

      await expect(result.current.deleteConfig()).rejects.toThrow(
        "Received '500 - Internal Server Error' while deleting periodic harvesting configuration"
      );

      expect(queryClient.getQueryData(queryKey)).toEqual(periodicConfig);
    });

    it('should pass network errors through', async () => {
      ky.delete.mockRejectedValue(networkError);

      const { result } = renderUsePeriodicConfig();

      await expect(result.current.deleteConfig()).rejects.toBe(networkError);
    });
  });
});
