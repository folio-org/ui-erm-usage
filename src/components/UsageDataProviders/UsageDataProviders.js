import React from 'react';
import PropTypes from 'prop-types';

import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import packageInfo from '../../../package';

import UsageDataProvidersView from './UsageDataProvidersView';
import UsageDataProviderForm from './UsageDataProviderForm';

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
    onSelectRow: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  create = () => {
  }

  render() {
    const { onSelectRow, onComponentWillUnmount, showSingleResult, browseOnly } = this.props;

    const resultsFormatter = {
      label: udp => udp.label,
      serviceType: udp => udp.serviceType,
      serviceUrl: udp => udp.serviceUrl,
      aggregator: udp => (udp.aggregator ? 'yes' : 'no'),
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
      visibleColumns={['label', 'serviceType', 'serviceUrl', 'aggregator']}
      resultsFormatter={resultsFormatter}
      onSelectRow={onSelectRow}
      onCreate={this.create}
      onComponentWillUnmount={onComponentWillUnmount}
      viewRecordPerms="users.item.get"
      newRecordPerms="users.item.post,login.item.post,perms.users.item.post"
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
      showSingleResult={showSingleResult}
      columnMapping={{
        label: 'Label',
        serviceType: 'Service Type',
        serviceUrl: 'Service Url',
        aggregator: 'Aggregator?'
      }}
      browseOnly={browseOnly}
    />);
  }
}

export default UsageDataProviders;
