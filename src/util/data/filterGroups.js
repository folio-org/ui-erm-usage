import { FormattedMessage } from 'react-intl';

const filterGroups = [
  {
    label: 'Harvesting status',
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    values: [
      { name: <FormattedMessage id="ui-erm-usage.general.status.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-erm-usage.general.status.inactive" />, cql: 'inactive' }
    ]
  },
  {
    label: 'Harvest via',
    name: 'harvestVia',
    cql: 'harvestingConfig.harvestVia',
    values: [
      { name: 'Sushi', cql: 'sushi' },
      { name: 'Aggregator', cql: 'aggregator' }
    ]
  },
  {
    label: 'Aggregators',
    name: 'aggregators',
    cql: 'harvestingConfig.aggregator.name',
    values: [],
    restrictWhenAllSelected: true
  },
  {
    label: 'Has failed reports',
    name: 'hasFailedReport',
    cql: 'hasFailedReport',
    values: [
      { name: <FormattedMessage id="ui-erm-usage.general.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-erm-usage.general.no" />, cql: 'no' }
    ]
  },
  {
    label: 'Tags',
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
  {
    label: 'Error Codes',
    name: 'errorCodes',
    cql: 'reportErrorCodes',
    operator: '=',
    values: [],
  },
  {
    label: 'Report Types',
    name: 'reportTypes',
    cql: 'reportTypes',
    operator: '=',
    values: [],
  }
];

export default filterGroups;
