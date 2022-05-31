import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import AggregatorDetails from './AggregatorDetails';
import AggregatorForm from './AggregatorForm';

// Still using redux-form here since EntryManager depends on it...
class AggregatorManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'aggregatorSettings',
      path: 'aggregator-settings',
      resourceShouldRefresh: true,
      perRequest: 100,
      params: {
        query: 'cql.allRecords=1',
        limit: '1000'
      }
    },
    aggregatorImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=true',
      throwErrors: false
    }
  });

  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      }),
      aggregatorImpls: PropTypes.shape()
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func
      })
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    })
  };

  render() {
    const entryList = _.sortBy(
      (this.props.resources.entries || {}).records || [],
      ['label']
    );

    const { resources } = this.props;
    const records = (resources.aggregatorImpls || {}).records || [];
    const implementations = records.length ? records[0].implementations : [];
    const serviceTypes = implementations.map(i => ({
      value: i.type,
      label: i.name
    }));

    return (
      <div
        data-test-aggregator-instances
        style={{ flex: '0 0 50%', left: '0px' }}
      >
        <EntryManager
          {...this.props}
          parentMutator={this.props.mutator}
          entryList={entryList}
          detailComponent={AggregatorDetails}
          entryFormComponent={AggregatorForm}
          paneTitle={this.props.label}
          entryLabel={this.props.label}
          onSelect={this.onSelect}
          validate={() => {}}
          nameKey="label"
          permissions={{
            put: 'ui-erm-usage.generalSettings.manage',
            post: 'ui-erm-usage.generalSettings.manage',
            delete: 'ui-erm-usage.generalSettings.manage'
          }}
          aggregators={serviceTypes}
        />
      </div>
    );
  }
}

export default AggregatorManager;
