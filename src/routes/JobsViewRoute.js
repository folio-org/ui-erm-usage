import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import JobsView from '../components/JobsView';
import filterGroups from '../util/data/filterGroupsJobsView';

const JobsViewRoute = ({ resources, mutator, stripes }) => {
  const [source] = useState(new StripesConnectedSource(
    { resources, mutator },
    stripes.logger,
    'jobs'
  ));
  source.update({ resources, mutator }, 'jobs');

  // Update timestamp on mount to ensure fresh data on each navigation
  useEffect(() => {
    mutator.timestamp.replace(Date.now());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mutator is stable, only run on mount

  return <JobsView filterGroups={filterGroups} source={source} />;
};

const createCQL = () => {
  return (queryParams, pathComponents, resourceValues, logger) => {
    const queryFn = makeQueryFunction('cql.allRecords=1', '', {}, filterGroups, 0);
    const tmp = queryFn(queryParams, pathComponents, resourceValues, logger);
    return tmp
      ? tmp
        .replace('status==', '')
        .replace('"scheduled"', 'nextStart=""')
        .replace('"running"', '(startedAt="" NOT finishedAt="")')
        .replace('"finished"', 'finishedAt=""')
      : tmp;
  };
};

JobsViewRoute.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    logger: PropTypes.shape().isRequired,
  }).isRequired,
};

JobsViewRoute.manifest = Object.freeze({
  query: {},
  jobs: {
    type: 'okapi',
    path: 'erm-usage-harvester/jobs',
    records: 'jobInfos',
    recordsRequired: '%{resultCount}',
    perRequest: 30,
    GET: {
      params: {
        providerId: '?{providerId:-}',
        timestamp: '%{timestamp}',
        query: createCQL(),
      },
      staticFallback: { params: {} },
    },
  },
  udps: {
    type: 'okapi',
    path: 'usage-data-providers',
    params: {
      limit: '1000',
    },
    records: 'usageDataProviders',
  },
  resultCount: {
    initialValue: 30,
  },
  timestamp: { initialValue: Date.now() },
});

export default stripesConnect(JobsViewRoute);
