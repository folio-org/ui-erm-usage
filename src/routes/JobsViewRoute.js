import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource, makeQueryFunction } from '@folio/stripes/smart-components';

import { useState } from 'react';
import JobsView from '../components/JobsView';
import filterGroups from '../util/data/filterGroupsJobsView';


const timestamp = Date.now();

const JobsViewRoute = ({ resources, mutator, stripes }) => {
  const [source] = useState(new StripesConnectedSource(
    { resources, mutator },
    stripes.logger,
    'jobs'
  ));
  source.update({ resources, mutator }, 'jobs');

  return <JobsView source={source} filterGroups={filterGroups} />;
};

const createCQL = () => {
  return (queryParams, pathComponents, resourceValues, logger) => {
    const tmp = makeQueryFunction('cql.allRecords=1', '', {}, filterGroups, 0)(queryParams, pathComponents, resourceValues, logger);
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
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    logger: PropTypes.shape().isRequired,
  }).isRequired
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
        query: createCQL()
      },
      staticFallback: { params: {} }
    }
  },
  udps: {
    type: 'okapi',
    path: 'usage-data-providers',
    params: {
      limit: '1000'
    },
    records: 'usageDataProviders'
  },
  resultCount: {
    initialValue: 30,
  },
  timestamp: {
    initialValue: timestamp,
  }
});

export default stripesConnect(JobsViewRoute);
