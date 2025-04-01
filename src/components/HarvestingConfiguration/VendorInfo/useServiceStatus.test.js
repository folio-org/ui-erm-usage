import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import useServiceStatus from './useServiceStatus';

const mockUrl = 'https://api.example.com/status';

global.fetch = jest.fn();

describe('useServiceStatus', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useServiceStatus(mockUrl));
    expect(result.current.status).toBeNull();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch and set status correctly if Service_Active = true', async () => {
    const mockResponse = [{ Service_Active: true }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl));

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set status correctly if Service_Active = false', async () => {
    const mockResponse = [{ Service_Active: false }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl));

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useServiceStatus(mockUrl));

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should handle invalid response structure', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ invalid: 'data' }),
    });

    const { result } = renderHook(() => useServiceStatus(mockUrl));

    await waitFor(() => {
      result.current.fetchStatus();
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.status).toBeNull();
    expect(result.current.error).toBe('Invalid response');
  });
});
