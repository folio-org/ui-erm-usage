import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import JobsView from '../components/JobsView';
import filterGroups from '../util/data/filterGroupsJobsView';
import useJobs from '../util/hooks/useJobs';

const queryFn = makeQueryFunction('cql.allRecords=1', '', {}, filterGroups, 0);

const toCQL = (urlQuery, logger) => {
  const cql = queryFn(urlQuery, {}, { query: urlQuery }, logger);

  return cql
    ? cql
      .replace('status==', '')
      .replace('"scheduled"', 'nextStart=""')
      .replace('"running"', '(startedAt="" NOT finishedAt="")')
      .replace('"finished"', 'finishedAt=""')
    : cql;
};

const JobsViewRoute = ({ resources, stripes }) => {
  const location = useLocation();
  const [createdBefore, setCreatedBefore] = useState(() => Date.now());

  const urlQuery = Object.fromEntries(new URLSearchParams(location.search));

  const {
    fetchMore,
    hasMore,
    isFetching,
    isSuccess,
    jobs,
    totalRecords,
  } = useJobs({
    createdBefore,
    providerId: urlQuery.providerId ?? '',
    query: toCQL(urlQuery, stripes.logger),
  });

  const source = {
    fetchMore,
    hasMore: () => hasMore,
    loaded: () => isSuccess,
    pending: () => isFetching,
    records: () => jobs,
    resources,
    totalCount: () => totalRecords,
  };

  return (
    <JobsView
      filterGroups={filterGroups}
      onRefresh={() => setCreatedBefore(Date.now())}
      source={source}
    />
  );
};

JobsViewRoute.propTypes = {
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    logger: PropTypes.shape().isRequired,
  }).isRequired,
};

JobsViewRoute.manifest = Object.freeze({
  query: {},
  udps: {
    type: 'okapi',
    path: 'usage-data-providers',
    params: {
      limit: '1000',
    },
    records: 'usageDataProviders',
  },
});

export default stripesConnect(JobsViewRoute);
