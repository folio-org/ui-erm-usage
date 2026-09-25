import { FormattedMessage } from 'react-intl';

import { COUNTER_SUSHI } from '../constants';

const filterGroups = [
  {
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    operator: '=',
    values: [
      { name: <FormattedMessage id="ui-erm-usage.general.status.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-erm-usage.general.status.inactive" />, cql: 'inactive' },
    ],
  },
  {
    name: 'harvestVia',
    cql: 'harvestingConfig.harvestVia',
    operator: '=',
    values: [{ name: COUNTER_SUSHI, cql: 'sushi' }],
  },
  {
    name: 'hasFailedReport',
    cql: 'hasFailedReport',
    operator: '=',
    values: [
      { name: <FormattedMessage id="ui-erm-usage.general.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-erm-usage.general.no" />, cql: 'no' },
    ],
  },
  {
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
  {
    name: 'errorCodes',
    cql: 'reportErrorCodes',
    operator: '=',
    values: [],
  },
  {
    name: 'reportTypes',
    cql: 'reportTypes',
    operator: '=',
    values: [],
  },
  {
    name: 'reportReleases',
    cql: 'reportReleases',
    operator: '=',
    values: [],
  },
  {
    name: 'status',
    cql: 'status',
    operator: '=',
    values: [
      { name: <FormattedMessage id="ui-erm-usage.general.status.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-erm-usage.general.status.inactive" />, cql: 'inactive' },
    ],
  },
];

export default filterGroups;
