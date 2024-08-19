import PropTypes from 'prop-types';
import { sortBy } from 'lodash';

import { EntryManager } from '@folio/stripes/smart-components';

import AggregatorDetails from './AggregatorDetails';
import AggregatorForm from './AggregatorForm';

// Still using redux-form here since EntryManager depends on it...
const AggregatorManager = ({
  label,
  resources,
  mutator,
  ...props
}) => {
  const entryList = sortBy(resources?.entries?.records || [], ['label']);

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
        {...props}
        parentMutator={mutator}
        entryList={entryList}
        detailComponent={AggregatorDetails}
        entryFormComponent={AggregatorForm}
        paneTitle={label}
        entryLabel={label}
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
};

AggregatorManager.manifest = Object.freeze({
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

AggregatorManager.propTypes = {
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
};

export default AggregatorManager;
