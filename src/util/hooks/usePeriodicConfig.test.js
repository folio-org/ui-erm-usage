import { renderHook } from '@testing-library/react-hooks';
import { StripesContext, useStripes } from '@folio/stripes/core';
import usePeriodicConfig from './usePeriodicConfig';
import Intl from '../../../test/jest/__mock__/intl.mock';

const expectedUrl = 'https://folio-testing-okapi.dev.folio.org/erm-usage-harvester/periodic';
const expectedHeaders = {
  'X-Okapi-Tenant': 'diku',
  'X-Okapi-Token': 'abc',
};

const assertFetchParameters = (
  fetch,
  method = 'GET',
  additionalHeaders = {},
  additionalParams = {}
) => {
  expect(fetch).toHaveBeenCalledWith(expectedUrl, {
    headers: {
      ...expectedHeaders,
      ...additionalHeaders,
    },
    method,
    ...additionalParams,
  });
};

describe('test usePeriodConfig hook', () => {
  const stripes = useStripes();
  const wrapper = ({ children }) => (
    <Intl>
      <StripesContext.Provider value={stripes}>{children}</StripesContext.Provider>
    </Intl>
  );

  describe('test fetchConfig', () => {
    test('fetch returns 200', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: 'mocked data',
        }),
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.fetchConfig()).resolves.toEqual({
        data: 'mocked data',
      });
      assertFetchParameters(fetch);
    });

    test('fetch returns 404', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.fetchConfig()).resolves.toEqual({});
      assertFetchParameters(fetch);
    });

    test('fetch returns 500', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 500,
        statusText: 'Internal server error',
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.fetchConfig())
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe(
          "Received '500 - Internal server error' while fetching periodic harvesting configuration"
        ));
      assertFetchParameters(fetch);
    });

    test('fetch fails', () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.fetchConfig())
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe('Failed to fetch'));
      assertFetchParameters(fetch);
    });
  });

  describe('test saveConfig', () => {
    const data = '';
    const assertFetchParametersForPost = (fetch) => assertFetchParameters(
      fetch,
      'POST',
      { 'content-type': 'application/json' },
      { body: JSON.stringify(data) }
    );

    test('fetch returns 201', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 201,
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.saveConfig(data)).resolves.toEqual({ status: 201 });
      assertFetchParametersForPost(fetch);
    });

    test('fetch returns 500', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 500,
        statusText: 'Internal server error',
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.saveConfig(data))
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe(
          "Received '500 - Internal server error' while saving periodic harvesting configuration"
        ));
      assertFetchParametersForPost(fetch);
    });

    test('fetch fails', () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.saveConfig(data))
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe('Failed to fetch'));
      assertFetchParametersForPost(fetch);
    });
  });

  describe('test deleteConfig', () => {
    test('fetch returns 204', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 204,
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.deleteConfig()).resolves.toEqual({ status: 204 });
      assertFetchParameters(fetch, 'DELETE');
    });

    test('fetch returns 500', () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 500,
        statusText: 'Internal server error',
      });
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.deleteConfig())
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe(
          "Received '500 - Internal server error' while deleting periodic harvesting configuration"
        ));
      assertFetchParameters(fetch, 'DELETE');
    });

    test('fetch fails', () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));
      const { result } = renderHook(() => usePeriodicConfig(), { wrapper });
      expect(result.current.deleteConfig())
        .rejects.toThrowError()
        .catch((err) => expect(err.message).toBe('Failed to fetch'));
      assertFetchParameters(fetch, 'DELETE');
    });
  });
});
