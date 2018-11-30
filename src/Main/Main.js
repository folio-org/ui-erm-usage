import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape
} from 'react-intl';
import {
  makeQueryFunction,
  SearchAndSort
} from '@folio/stripes/smart-components';
import packageInfo from '../../package';

import UsageDataProvidersView from '../UDPViews/UsageDataProviderView';
import UsageDataProviderForm from '../UDPViews/UsageDataProviderForm';

import VendorName from '../VendorName';
import AggregatorName from '../AggregatorName';
import LatestReportDate from '../LatestReportDate';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  {
    label: 'Harvesting Status',
    name: 'harvestingStatus',
    cql: 'harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' }
    ],
  }
];

class UsageDataProviders extends React.Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title',
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
            '(label="%{query.query}*")',
            {
              'Provider Name': 'label'
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      usageDataProviders: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      usageDataProviders: PropTypes.shape({
        POST: PropTypes.func.isRequired,
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

  renderVendorName = (udp) => {
    return (
      <VendorName
        vendorId={udp.vendorId}
        stripes={this.props.stripes}
      />);
  }

  renderAggregatorName = (udp) => {
    return (
      <AggregatorName
        aggregatorId={udp.aggregator.id}
        stripes={this.props.stripes}
      />);
  }

  renderLatestReportDate = (udp) => {
    return (
      <LatestReportDate
        vendorId={udp.vendorId}
        stripes={this.props.stripes}
      />);
  }

  render() {
    const { onSelectRow, onComponentWillUnmount, showSingleResult, browseOnly, stripes, intl } = this.props;

    const resultsFormatter = {
      name: udp => udp.label,
      vendor: udp => this.renderVendorName(udp),
      platform: udp => udp.platformId,
      harvestingStatus: udp => udp.harvestingStatus,
      aggregator: udp => (udp.aggregator ? this.renderAggregatorName(udp) : 'None'),
      latestStats: udp => this.renderLatestReportDate(udp),
    };

    return (<SearchAndSort
      packageInfo={packageInfo}
      objectName="usageDataProvider"
      filterConfig={filterConfig}
      initialResultCount={INITIAL_RESULT_COUNT}
      resultCountIncrement={RESULT_COUNT_INCREMENT}
      viewRecordComponent={UsageDataProvidersView}
      editRecordComponent={UsageDataProviderForm}
      newRecordInitialValues={{}}
      visibleColumns={['name', 'vendor', 'platform', 'harvestingStatus', 'aggregator', 'latestStats']}
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
        name: intl.formatMessage({ id: 'ui-erm-usage.information.providerName' }),
        vendor: intl.formatMessage({ id: 'ui-erm-usage.information.vendor' }),
        platform: intl.formatMessage({ id: 'ui-erm-usage.information.platform' }),
        harvestingStatus: intl.formatMessage({ id: 'ui-erm-usage.information.harvestingStatus' }),
        aggregator: intl.formatMessage({ id: 'ui-erm-usage.information.aggregator' }),
        latestStats: intl.formatMessage({ id: 'ui-erm-usage.information.latestStatistics' })
      }}
      browseOnly={browseOnly}
      stripes={stripes}
    />);
  }
}

export default injectIntl(UsageDataProviders);
