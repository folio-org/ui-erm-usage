import { filters2cql } from '@folio/stripes/components';

import { NO_SERVICE_TYPE } from '../constants';
import filterGroups, { parseServiceTypes } from './filterGroups';

describe('parseServiceTypes', () => {
  it('should query selected service types', () => {
    expect(parseServiceTypes(['cs50', 'cs51']))
      .toBe('(harvestingConfig.sushiConfig.serviceType=("cs50" or "cs51"))');
  });

  it('should query missing and empty service types for "No service type"', () => {
    expect(parseServiceTypes([NO_SERVICE_TYPE])).toBe(
      '((cql.allRecords=1 NOT harvestingConfig.sushiConfig.serviceType="") ' +
      'or harvestingConfig.sushiConfig.serviceType=="")'
    );
  });

  it('should combine selected service types and "No service type" with or', () => {
    expect(parseServiceTypes(['cs41', NO_SERVICE_TYPE])).toBe(
      '(harvestingConfig.sushiConfig.serviceType=("cs41") ' +
      'or (cql.allRecords=1 NOT harvestingConfig.sushiConfig.serviceType="") ' +
      'or harvestingConfig.sushiConfig.serviceType=="")'
    );
  });

  it('should escape quotes in service types', () => {
    expect(parseServiceTypes(['cs"41']))
      .toBe('(harvestingConfig.sushiConfig.serviceType=("cs\\"41"))');
  });

  it('should be used for the serviceTypes filter and combined with other filters', () => {
    expect(filters2cql(filterGroups, 'status.active,serviceTypes.cs50,serviceTypes.cs51'))
      .toBe('status="active" and (harvestingConfig.sushiConfig.serviceType=("cs50" or "cs51"))');
  });
});
