import '../../../test/jest/__mock__';

import {
  act,
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import StripesQueryProvider from '../../../test/jest/helpers/StripesQueryProvider';
import stubHarvester from '../../../test/jest/helpers/stubHarvester';
import useJobs from './useJobs';

const jobs = (count) => Array.from({ length: count }, (unused, i) => ({ id: `job-${i}` }));

const renderUseJobs = (params) => renderHook(
  ({ createdBefore = 1000, providerId = '', query }) => useJobs({ createdBefore, providerId, query }),
  { initialProps: params ?? {}, wrapper: StripesQueryProvider }
);

describe('useJobs', () => {
  it('should ask for the first page under the given snapshot', async () => {
    const requests = stubHarvester(jobs(5));

    const { result } = renderUseJobs({ createdBefore: 1234, providerId: 'abc', query: 'type=="provider"' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requests).toEqual([
      {
        limit: '30',
        offset: '0',
        providerId: 'abc',
        query: 'type=="provider"',
        timestamp: '1234',
      },
    ]);
  });

  it('should omit the query parameter rather than send it empty', async () => {
    const requests = stubHarvester();

    const { result } = renderUseJobs({ query: undefined });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requests[0]).not.toHaveProperty('query');
  });

  it('should report the records and the total', async () => {
    stubHarvester(jobs(42));

    const { result } = renderUseJobs();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.jobs).toHaveLength(30);
    expect(result.current.totalRecords).toBe(42);
  });

  it('should not report a total until the first page lands', () => {
    stubHarvester(jobs(5));

    const { result } = renderUseJobs();

    expect(result.current.totalRecords).toBeUndefined();
    expect(result.current.hasMore).toBe(false);
  });

  it('should page by offset, carrying only the rows that are new', async () => {
    const requests = stubHarvester(jobs(100));

    const { result } = renderUseJobs();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => { result.current.fetchMore(); });
    await waitFor(() => expect(result.current.jobs).toHaveLength(60));

    expect(requests.map((r) => r.limit)).toEqual(['30', '30']);
    expect(requests.map((r) => r.offset)).toEqual(['0', '30']);
    expect(result.current.jobs).toEqual(jobs(60));
  });

  it('should report more rows until the list is complete', async () => {
    stubHarvester(jobs(45));

    const { result } = renderUseJobs();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasMore).toBe(true);

    act(() => { result.current.fetchMore(); });
    await waitFor(() => expect(result.current.jobs).toHaveLength(45));

    expect(result.current.hasMore).toBe(false);
  });

  it('should stop paging when a page comes back empty', async () => {
    const requests = stubHarvester(jobs(100), { available: 30 });

    const { result } = renderUseJobs();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => { result.current.fetchMore(); });
    await waitFor(() => expect(requests).toHaveLength(2));

    expect(result.current.hasMore).toBe(false);
    expect(result.current.jobs).toHaveLength(30);
  });

  it('should refetch when the snapshot changes', async () => {
    const requests = stubHarvester(jobs(5));

    const { rerender, result } = renderUseJobs({ createdBefore: 1000 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ createdBefore: 2000 });
    await waitFor(() => expect(requests).toHaveLength(2));

    expect(requests.map((r) => r.timestamp)).toEqual(['1000', '2000']);
  });

  it('should serve an unchanged snapshot from cache', async () => {
    const requests = stubHarvester(jobs(5));

    const { rerender, result } = renderUseJobs({ createdBefore: 1000 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ createdBefore: 1000 });
    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(requests).toHaveLength(1);
  });
});
