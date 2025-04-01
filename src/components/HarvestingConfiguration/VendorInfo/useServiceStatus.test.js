import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useServiceStatus from './useServiceStatus';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
}));

const mockUrl = 'https://api.example.com/status';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useServiceStatus', () => {
  beforeEach(() => {
    useOkapiKy.mockClear();
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({
        json: () => Promise.resolve([{ Service_Active: true }]),
      })),
    });
  });

  it('should fetch and set status correctly if Service_Active = true', async () => {
    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(useOkapiKy).toHaveBeenCalled();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set status correctly if Service_Active = false', async () => {
    useOkapiKy.mockReturnValueOnce({
      get: jest.fn(() => ({
        json: () => Promise.resolve([{ Service_Active: false }]),
      })),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    useOkapiKy.mockReturnValueOnce({
      get: jest.fn(() => {
        throw new Error('Network error');
      }),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error.message).toBe('Network error');
  });

  it('should handle invalid response structure', async () => {
    useOkapiKy.mockReturnValueOnce({
      get: jest.fn(() => ({
        json: () => Promise.resolve({ invalid: 'data' }),
      })),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error.message).toBe('Invalid response');
  });
});
