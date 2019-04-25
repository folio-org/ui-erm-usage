import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl';
import {
  makeQueryFunction,
  SearchAndSort
} from '@folio/stripes/smart-components';
import packageInfo from '../package';

import UsageDataProvidersView from './components/UsageDataProviders/UsageDataProviderView';
import UsageDataProviderForm from './components/UsageDataProviders/UsageDataProviderForm';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  {
    label: <FormattedMessage id="ui-erm-usage.information.harvestingStatus" />,
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' }
    ],
  },
  {
    label: <FormattedMessage id="ui-erm-usage.aggregatorInfo.harvestVia" />,
    name: 'harvestVia',
    cql: 'harvestingConfig.harvestVia',
    values: [
      { name: 'Sushi', cql: 'sushi' },
      { name: 'Aggregator', cql: 'aggregator' }
    ],
  },
  {
    label: <FormattedMessage id="ui-erm-usage.information.aggregator" />,
    name: 'harvestingConfig',
    cql: 'harvestingConfig.aggregator.name',
    values: [],
    restrictWhenAllSelected: true,
  },
];

class UsageDataProviders extends React.Component {
  static manifest = Object.freeze({
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'label',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'usageDataProviders',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'usage-data-providers',
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*" or vendor="%{query.query}*" or platform="%{query.query}*" or harvestingConfig.aggregator.name="%{query.query}*")',
            {
              'label': 'label',
              'harvestingStatus': 'harvestingConfig.harvestingStatus',
              'latestStats': 'latestReport',
              'aggregator': 'harvestingConfig.aggregator.name',
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    aggregatorSettings: {
      type: 'okapi',
      records: 'aggregatorSettings',
      path: 'aggregator-settings',
    },
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false'
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      aggregatorSettings: PropTypes.shape(),
      harvesterImpls: PropTypes.shape(),
      numFiltersLoaded: PropTypes.number,
      usageDataProviders: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      usageDataProviders: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
      numFiltersLoaded: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func,
      }).isRequired,
    }).isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  // Index of aggregatorName filter in filterConfig
  static aggFilterIndex = 2;

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.state = {};
  }

  /**
   * fill in the filter values
   */
  static getDerivedStateFromProps(props) {
    // aggregators
    const aggSettings = (props.resources.aggregatorSettings || {}).records || [];
    if (aggSettings.length) {
      const oldValuesLength = filterConfig[UsageDataProviders.aggFilterIndex].values.length;
      filterConfig[UsageDataProviders.aggFilterIndex].values = aggSettings.map(rec => ({ name: rec.label, cql: rec.label }));
      // Always include the query clause: https://github.com/folio-org/stripes-components/tree/master/lib/FilterGroups#filter-configuration
      filterConfig[UsageDataProviders.aggFilterIndex].restrictWhenAllSelected = true;
      if (oldValuesLength === 0) {
        const numFiltersLoaded = props.resources.numFiltersLoaded;
        props.mutator.numFiltersLoaded.replace(numFiltersLoaded + 1); // triggers refresh of records
      }
    }
    return null;
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  create = (usageDataProvider) => {
    const { mutator } = this.props;
    mutator.records.POST(usageDataProvider)
      .then(() => {
        this.closeNewInstance();
      });
  }

  doHarvestViaAggregator = (udp) => {
    return udp.harvestingConfig.harvestVia === 'aggregator';
  }

  extractHarvesterImpls = (resources) => {
    const records = (resources.harvesterImpls || {}).records || [];
    const implementations = records.length
      ? records[0].implementations
      : [];
    return implementations.map(i => ({
      value: i.type,
      label: i.name
    }));
  }

  render() {
    const { browseOnly, intl, onComponentWillUnmount, onSelectRow, resources, showSingleResult, stripes } = this.props;

    const resultsFormatter = {
      name: udp => udp.label,
      harvestingStatus: udp => udp.harvestingConfig.harvestingStatus,
      latestStats: udp => udp.latestReport,
      aggregator: udp => (this.doHarvestViaAggregator(udp) ? udp.harvestingConfig.aggregator.name : '-'),
    };

    const detailProps = {
      harvesterImpls: this.extractHarvesterImpls(resources),
    };

    return (
      <div data-test-udp-instances>
        <SearchAndSort
          packageInfo={packageInfo}
          objectName="usageDataProvider"
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordComponent={UsageDataProvidersView}
          editRecordComponent={UsageDataProviderForm}
          newRecordInitialValues={{}}
          visibleColumns={['label', 'harvestingStatus', 'latestStats', 'aggregator']}
          resultsFormatter={resultsFormatter}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          onComponentWillUnmount={onComponentWillUnmount}
          viewRecordPerms="usagedataproviders.item.get"
          newRecordPerms="usagedataproviders.item.post"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          showSingleResult={showSingleResult}
          columnMapping={{
            label: intl.formatMessage({ id: 'ui-erm-usage.information.providerName' }),
            harvestingStatus: intl.formatMessage({ id: 'ui-erm-usage.information.harvestingStatus' }),
            latestStats: intl.formatMessage({ id: 'ui-erm-usage.information.latestStatistics' }),
            aggregator: intl.formatMessage({ id: 'ui-erm-usage.information.aggregator' })
          }}
          browseOnly={browseOnly}
          stripes={stripes}
          detailProps={detailProps}
        />
      </div>
    );
  }
}

export default injectIntl(UsageDataProviders);
