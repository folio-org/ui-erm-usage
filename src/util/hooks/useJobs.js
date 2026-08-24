import { useInfiniteQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const PAGE_SIZE = 30;

const useJobs = ({ createdBefore, providerId, query }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'jobs' });

  const searchParams = {
    limit: PAGE_SIZE,
    providerId,
    timestamp: createdBefore,
    ...(query ? { query } : {}),
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
  } = useInfiniteQuery(
    [namespace, searchParams],
    ({ pageParam: offset = 0, signal }) => ky
      .get('erm-usage-harvester/jobs', { searchParams: { ...searchParams, offset }, signal })
      .json(),
    {
      getNextPageParam: (lastPage, pages) => {
        const loaded = pages.reduce((count, page) => count + page.jobInfos.length, 0);
        const done = lastPage.jobInfos.length === 0 || loaded >= lastPage.totalRecords;

        return done ? undefined : loaded;
      },
      keepPreviousData: true,
    }
  );

  const pages = data?.pages ?? [];
  const lastPage = pages[pages.length - 1];

  return {
    fetchMore: fetchNextPage,
    hasMore: Boolean(hasNextPage),
    isFetching,
    isSuccess,
    jobs: pages.flatMap((page) => page.jobInfos),
    totalRecords: lastPage?.totalRecords,
  };
};

export default useJobs;
