import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import ky from 'ky';

import useServiceStatus from './useServiceStatus';

jest.mock('ky', () => ({
  get: jest.fn(),
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
    ky.get.mockClear();
  });

  it('should fetch and set status correctly if Service_Active = true', async () => {
    ky.get.mockReturnValueOnce({
      json: () => Promise.resolve([{ Service_Active: true }]),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set status correctly if Service_Active = false', async () => {
    ky.get.mockReturnValueOnce({
      json: () => Promise.resolve([{ Service_Active: false }]),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid response structure', async () => {
    ky.get.mockReturnValueOnce({
      json: () => Promise.resolve([{ invalid: 'data' }]),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl), { wrapper });

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error.message).toBe('Invalid response');
  });
});
