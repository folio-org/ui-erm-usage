import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import JobsView from '../components/JobsView';
import filterGroups from '../util/data/filterGroupsJobsView';
import useJobs from '../util/hooks/useJobs';

const queryFn = makeQueryFunction('cql.allRecords=1', '', {}, filterGroups, 0);

const toCQL = (queryParams, logger) => {
  const cql = queryFn(queryParams, {}, { query: queryParams }, logger);

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

  // Not the `query` resource: stripes-core mirrors location into it a render late, so a
  // fetch keyed off the mirror runs once under the previous filters first.
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));

  const {
    fetchMore,
    hasMore,
    isFetching,
    isSuccess,
    jobs,
    totalRecords,
  } = useJobs({
    createdBefore,
    providerId: queryParams.providerId ?? '',
    query: toCQL(queryParams, stripes.logger),
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
  // Read by JobsView's queryGetter for the current sort and filters.
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
