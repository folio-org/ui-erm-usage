import {
  isEmpty,
  isNil,
  omit,
  sortBy,
} from 'lodash';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { EntryManager } from '@folio/stripes/smart-components';

import {
  formatUnsupportedLabel,
  isServiceTypeSupported,
} from '../../util/harvesterImpls';
import AggregatorDetails from './AggregatorDetails';
import AggregatorForm from './AggregatorForm';

const parseInitialValues = (aggregator) => {
  if (!aggregator) return aggregator;

  // displayLabel is only used for display in the EntryManager and must not be saved
  const aggregatorWithoutDisplayLabel = omit(aggregator, 'displayLabel');
  const { aggregatorConfig } = aggregatorWithoutDisplayLabel;

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
    ...aggregatorWithoutDisplayLabel,
    aggregatorConfig: aggregatorConfigArray.length > 0 ? aggregatorConfigArray : undefined,
    accountConfig: {
      ...aggregator.accountConfig,
      displayContact: aggregator.accountConfig?.displayContact?.length > 0
        ? aggregator.accountConfig.displayContact
        : undefined,
    },
  };
};

const onBeforeSave = (formData) => {
  const { aggregatorConfig, ...rest } = omit(formData, 'displayLabel');

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
    aggregatorConfig: aggregatorConfigObj,
  };
};

const AggregatorManager = ({
  label,
  resources,
  mutator,
  stripes,
}) => {
  const intl = useIntl();
  const records = resources.aggregatorImpls?.records ?? [];
  const entryList = sortBy(resources?.entries?.records || [], ['label'])
    .map(entry => ({
      ...entry,
      displayLabel: formatUnsupportedLabel(intl, entry.label, isServiceTypeSupported(records, entry.serviceType)),
    }));
  const implementations = records.length ? records[0].implementations : [];
  const serviceTypes = implementations.map(i => ({
    value: i.type,
    label: i.name,
  }));

  return (
    <div style={{ flex: '0 0 50%', left: '0px' }}>
      <EntryManager
        aggregatorImpls={records}
        aggregators={serviceTypes}
        detailComponent={AggregatorDetails}
        enableDetailsActionMenu
        entryFormComponent={AggregatorForm}
        entryLabel={label}
        entryList={entryList}
        nameKey="displayLabel"
        onBeforeSave={onBeforeSave}
        paneTitle={label}
        parentMutator={mutator}
        parseInitialValues={parseInitialValues}
        permissions={{
          put: 'ui-erm-usage.generalSettings.manage',
          post: 'ui-erm-usage.generalSettings.manage',
          delete: 'ui-erm-usage.generalSettings.manage',
        }}
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
      limit: '1000',
    },
  },
  aggregatorImpls: {
    type: 'okapi',
    path: 'erm-usage-harvester/impl?aggregator=true',
    throwErrors: false,
  },
});

AggregatorManager.propTypes = {
  label: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    entries: PropTypes.shape({
      DELETE: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    aggregatorImpls: PropTypes.shape(),
    entries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape(),
};

export default AggregatorManager;
