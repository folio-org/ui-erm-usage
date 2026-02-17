import PropTypes from 'prop-types';
import { sortBy, isNil, isEmpty } from 'lodash';

import { EntryManager } from '@folio/stripes/smart-components';

import AggregatorDetails from './AggregatorDetails';
import AggregatorForm from './AggregatorForm';

const parseInitialValues = (aggregator) => {
  if (!aggregator) return aggregator;

  const { aggregatorConfig } = aggregator;

  // Transform aggregatorConfig from object to array
  let aggregatorConfigArray = [];
  if (!isNil(aggregatorConfig) && !isEmpty(aggregatorConfig)) {
    aggregatorConfigArray = Object.keys(aggregatorConfig).map((key) => ({
      key,
      value: aggregatorConfig[key],
      isInitial: true,
    }));
  }

  return {
    ...aggregator,
    aggregatorConfig: aggregatorConfigArray.length > 0 ? aggregatorConfigArray : undefined,
    accountConfig: {
      ...aggregator.accountConfig,
      displayContact: aggregator.accountConfig?.displayContact?.length > 0
        ? aggregator.accountConfig.displayContact
        : undefined
    }
  };
};

const onBeforeSave = (formData) => {
  const { aggregatorConfig, ...rest } = formData;

  // Transform aggregatorConfig from array to object
  const aggregatorConfigObj = {};
  if (aggregatorConfig && Array.isArray(aggregatorConfig)) {
    aggregatorConfig.forEach(field => {
      if (field.key && field.key.trim() !== '') {
        aggregatorConfigObj[field.key] = field.value || '';
      }
    });
  }

  return {
    ...rest,
    aggregatorConfig: aggregatorConfigObj
  };
};

const AggregatorManager = ({
  label,
  resources,
  mutator,
  stripes,
}) => {
  const entryList = sortBy(resources?.entries?.records || [], ['label']);
  const records = resources.aggregatorImpls?.records ?? [];
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
        parseInitialValues={parseInitialValues}
        onBeforeSave={onBeforeSave}
        aggregators={serviceTypes}
        stripes={stripes}
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
  stripes: PropTypes.shape(),
};

export default AggregatorManager;
