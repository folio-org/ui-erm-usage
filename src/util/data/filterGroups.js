import { FormattedMessage } from 'react-intl';

import { escapeCqlValue } from '@folio/stripes/util';

import { NO_SERVICE_TYPE } from '../constants';

const SERVICE_TYPE_CQL = 'harvestingConfig.sushiConfig.serviceType';

// Selected service types and "No service type" (missing or empty) are combined with "or"
export const parseServiceTypes = (values) => {
  const codes = values.filter(v => v !== NO_SERVICE_TYPE);
  const clauses = [];

  if (codes.length) {
    const quotedCodes = codes.map(c => `"${escapeCqlValue(c)}"`).join(' or ');
    clauses.push(`${SERVICE_TYPE_CQL}=(${quotedCodes})`);
  }

  if (values.includes(NO_SERVICE_TYPE)) {
    clauses.push(`(cql.allRecords=1 NOT ${SERVICE_TYPE_CQL}="") or ${SERVICE_TYPE_CQL}==""`);
  }

  return `(${clauses.join(' or ')})`;
};

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
    name: 'serviceTypes',
    cql: SERVICE_TYPE_CQL,
    values: [],
    parse: parseServiceTypes,
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
