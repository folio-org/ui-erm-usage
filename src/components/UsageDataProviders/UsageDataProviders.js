import React from 'react';
import PropTypes from 'prop-types';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import packageInfo from '../../../package';

import UsageDataProvidersView from './UsageDataProvidersView';
import UsageDataProviderForm from './UsageDataProviderForm';
import VendorName from '../ViewSections/VendorName';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  {
    label: 'Harvesting Status',
    name: 'harvestingStatus',
    cql: 'harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' },
      { name: 'In Process', cql: 'in process' },
      { name: 'Not Possible', cql: 'not possible' },
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
              'Label': 'label',
              'Service Type': 'serviceType',
              'Service Url': 'serviceUrl'
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
    
  }

  render() {
    const { onSelectRow, onComponentWillUnmount, showSingleResult, browseOnly } = this.props;

    const resultsFormatter = {
      name: udp => udp.label,
      vendor: udp => this.renderVendorName(udp),
      harvestingStatus: udp => udp.harvestingStatus,
      aggregator: udp => (udp.aggregator ? udp.aggregator.id : 'None'),
      latestStats: () => 'TODO',
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
      visibleColumns={['name', 'vendor', 'harvestingStatus', 'aggregator', 'latestStats']}
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
        name: 'Platform Name',
        vendor: 'Vendor',
        harvestingStatus: 'Harvesting Status',
        aggregator: 'Aggregator',
        latestStats: 'Latest Statistics'
      }}
      browseOnly={browseOnly}
    />);
  }
}

export default UsageDataProviders;
