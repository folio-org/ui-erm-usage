import React from 'react';
import { screen } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import HarvestingConfigurationView from './HarvestingConfigurationView';

const stubUDP = {
  id: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
  label: 'American Chemical Society',
  harvestingConfig: {
    harvestingStatus: 'active',
    harvestVia: 'aggregator',
    aggregator: {
      id: '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
      name: 'German National Statistics Server',
      vendorCode: 'ACSO',
    },
    reportRelease: 5,
    requestedReports: ['IR', 'TR'],
    harvestingStart: '2019-01',
  },
  sushiCredentials: {
    customerId: '0000000000',
    requestorId: '00000',
    requestorName: 'Opentown Libraries',
    requestorMail: 'electronic@lib.optentown.edu',
  },
  latestReport: '2018-04',
  earliestReport: '2018-01',
  hasFailedReport: 'no',
  reportErrorCodes: [],
  reportTypes: ['JR1'],
  notes:
    'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
};

const stubHarvesterImpls = [
  {
    value: 'cs41',
    label: 'Counter Sushi 4.1',
  },
];

const stubSettings = [
  {
    id: '38d7d9ae-95aa-4134-91b0-4ddbd9143fa7',
    module: 'ERM-USAGE',
    configName: 'hide_credentials',
    enabled: true,
    value: 'true',
  },
];

const onToggle = jest.fn;

jest.mock('./AggregatorInfo/AggregatorContactInfo', () => {
  return () => <span>AggregatorContactInfo</span>;
});

const renderHarvestingConfigurationView = (stripes) => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        usageDataProvider={stubUDP}
        stripes={stripes}
        onToggle={onToggle}
        settings={stubSettings}
        harvesterImpls={stubHarvesterImpls}
      />
    </MemoryRouter>
  );
};

describe('HarvestingConfigurationView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render HarvestingConfigurationView', async () => {
    await renderHarvestingConfigurationView(stripes);
    expect(screen.getByText('Harvesting status')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
  });
});
