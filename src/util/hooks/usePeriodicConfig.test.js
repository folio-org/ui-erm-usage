import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  renderHook,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import periodicConfig from '../../../test/fixtures/periodicConfig';
import Intl from '../../../test/jest/__mock__/intl.mock';
import {
  API_HARVESTER_PERIODIC,
  KEY_HARVESTER_PERIODIC,
} from '../constants';
import usePeriodicConfig from './usePeriodicConfig';

const queryKey = [KEY_HARVESTER_PERIODIC];

const httpError = (status, statusText) => Object.assign(new Error(statusText), {
  response: { status, statusText },
});
const serverError = httpError(500, 'Internal Server Error');
const networkError = new TypeError('Failed to fetch');

const data = {
  startAt: '2026-10-21T08:00:00+0000',
  periodicInterval: 'monthly',
};

describe('usePeriodicConfig', () => {
  let queryClient;
  let ky;

  const mockGet = (promise) => {
    ky.get.mockReturnValue({
      json: jest.fn(() => promise),
    });
  };

  const createWrapper = () => {
    const wrapper = ({ children }) => (
      <Intl>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Intl>
    );

    return wrapper;
  };

  const renderUsePeriodicConfig = () => renderHook(
    () => usePeriodicConfig(),
    { wrapper: createWrapper() }
  );

  const PeriodicConfigTest = ({ onError }) => {
    const {
      config,
      saveConfig,
      deleteConfig,
    } = usePeriodicConfig();

    const handleSave = () => saveConfig(data).catch(onError);
    const handleDelete = () => deleteConfig().catch(onError);

    return (
      <>
        <div data-testid="config">{JSON.stringify(config)}</div>
        <button onClick={handleSave} type="button">
          Save
        </button>
        <button onClick={handleDelete} type="button">
          Delete
        </button>
      </>
    );
  };

  const renderPeriodicConfigTest = (onError = jest.fn()) => {
    render(
      <Intl>
        <QueryClientProvider client={queryClient}>
          <PeriodicConfigTest onError={onError} />
        </QueryClientProvider>
      </Intl>
    );

    return onError;
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

  afterEach(() => {
    queryClient.clear();
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
    it('should post the config and merge it into the fetched one', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.post.mockResolvedValue(new Response(null, { status: 204 }));

      renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByTestId('config')).toHaveTextContent(
          JSON.stringify({ ...periodicConfig, ...data })
        );
      });

      expect(ky.post).toHaveBeenCalledWith(API_HARVESTER_PERIODIC, {
        json: data,
      });
    });

    it('should set the config if none exists', async () => {
      mockGet(Promise.reject(httpError(404, 'Not Found')));
      ky.post.mockResolvedValue(new Response(null, { status: 204 }));

      renderPeriodicConfigTest();

      await waitFor(() => {
        expect(screen.getByTestId('config')).toHaveTextContent('{}');
      });

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByTestId('config')).toHaveTextContent(
          JSON.stringify(data)
        );
      });
    });

    it('should reject with a translated error if the server fails', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.post.mockRejectedValue(serverError);

      const view = renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(view).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Received '500 - Internal Server Error' while saving periodic harvesting configuration",
          })
        );
      });

      expect(screen.getByTestId('config')).toHaveTextContent(
        JSON.stringify(periodicConfig)
      );
    });

    it('should pass network errors through', async () => {
      ky.post.mockRejectedValue(networkError);

      const view = renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(view).toHaveBeenCalledWith(networkError);
      });
    });
  });

  describe('deleting', () => {
    it('should delete the config without an id and clear it', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.delete.mockResolvedValue(new Response(null, { status: 204 }));

      renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(screen.getByTestId('config')).toHaveTextContent('{}');
      });

      expect(ky.delete).toHaveBeenCalledWith(API_HARVESTER_PERIODIC, {});
    });

    it('should reject with a translated error if the server fails', async () => {
      queryClient.setQueryData(queryKey, periodicConfig);
      ky.delete.mockRejectedValue(serverError);

      const view = renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(view).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Received '500 - Internal Server Error' while deleting periodic harvesting configuration",
          })
        );
      });

      expect(screen.getByTestId('config')).toHaveTextContent(
        JSON.stringify(periodicConfig)
      );
    });

    it('should pass network errors through', async () => {
      ky.delete.mockRejectedValue(networkError);

      const view = renderPeriodicConfigTest();

      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(view).toHaveBeenCalledWith(networkError);
      });
    });
  });
});
