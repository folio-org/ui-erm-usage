import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

import UDPs from '../components/views/UDPs';
import urls from '../util/urls';

import filterGroups from '../util/data/filterGroups';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class UDPsRoute extends React.Component {
  static manifest = Object.freeze({
    usageDataProviders: {
      type: 'okapi',
      path: 'usage-data-providers',
      records: 'usageDataProviders',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(keywords all "%{query.query}*")',
            {
              label: 'label',
              harvestingStatus: 'harvestingConfig.harvestingStatus',
              latestStats: 'latestReport',
              aggregator: 'harvestingConfig.aggregator.name'
            },
            filterGroups,
            2
          )
        },
        staticFallback: { params: {} }
      }
    },
    aggregatorSettings: {
      type: 'okapi',
      path: 'aggregator-settings',
      records: 'aggregatorSettings'
    },
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false',
      throwErrors: false
    },
    errorCodes: {
      type: 'okapi',
      path: 'counter-reports/errors/codes',
      records: 'errorCodes'
    },
    reportTypes: {
      type: 'okapi',
      path: 'counter-reports/reports/types',
      records: 'reportTypes'
    },
    reportReleases: {
      type: 'okapi',
      path: 'counter-reports/reports/releases',
      records: 'reportReleases'
    },
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: 'harvestingStatus.active',
        sort: 'label'
      }
    },
    tags: {
      type: 'okapi',
      path: 'tags',
      params: {
        limit: '1000',
        query: 'cql.allRecords=1 sortby label'
      },
      records: 'tags'
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT }
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    mutator: PropTypes.shape({
      usageDataProviders: PropTypes.shape({
        POST: PropTypes.func.isRequired
      }),
      numFiltersLoaded: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }),
      query: PropTypes.shape({
        update: PropTypes.func
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      aggregatorSettings: PropTypes.shape(),
      harvesterImpls: PropTypes.shape(),
      numFiltersLoaded: PropTypes.number,
      usageDataProviders: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    }).isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.object
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(
      this.props,
      this.logger,
      'usageDataProviders'
    );

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(
        prevProps,
        this.logger,
        'usageDataProviders'
      );
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (
        oldCount !== 1 ||
        (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)
      ) {
        const record = newRecords[0];
        history.push(`${urls.udpView(record.id)}${location.search}`);
      }
    }
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  };

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  };

  render() {
    const { location, match, children, resources, history } = this.props;

    if (this.source) {
      this.source.update(this.props, 'usageDataProviders');
    }

    return (
      <UDPs
        data={{
          udps: get(resources, 'usageDataProviders.records', []),
          aggregators: get(resources, 'aggregatorSettings.records', []),
          tags: get(resources, 'tags.records', []),
          errorCodes: get(resources, 'errorCodes.records', []),
          reportTypes: get(resources, 'reportTypes.records', []),
          reportReleases: get(resources, 'reportReleases.records', []),
        }}
        selectedRecordId={match.params.id}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchField={this.searchField}
        searchString={location.search}
        source={this.source}
        history={history}
        location={location}
      >
        {children}
      </UDPs>
    );
  }
}

export default stripesConnect(UDPsRoute);
