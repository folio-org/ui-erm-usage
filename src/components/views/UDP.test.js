import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import UDP from './UDP';

const stubUDP = {
  id: '00db3e61-e08e-4f8b-93ee-8e60fd402fc8',
  label: 'Otto Harrassowitz GmbH & Co. KG',
  harvestingConfig: {
    harvestingStatus: 'active',
    harvestVia: 'sushi',
    sushiConfig: {
      serviceType: 'cs41',
      serviceUrl: 'https://counter.harra.de/counter/webservice/sushi',
    },
    reportRelease: 4,
    requestedReports: ['JR1'],
    harvestingStart: '2016-01',
  },
  sushiCredentials: {
    customerId: '0000000000',
    requestorId: '00000000-0000-0000-0000-000000000000',
    requestorName: 'Opentown Libraries',
    requestorMail: 'electronic@lib.optentown.edu',
  },
  hasFailedReport: 'no',
  reportErrorCodes: [],
  reportTypes: [],
  notes:
    'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
};

const stubCounterReports = [
  {
    year: 2018,
    reportsPerType: [
      {
        reportType: 'JR1',
        counterReports: [
          {
            id: 'c07aa46b-fbca-45c8-bd44-c7f9a3648586',
            downloadTime: '2019-04-12T13:33:38.212+00:00',
            release: '4',
            reportName: 'JR1',
            yearMonth: '2018-04',
            providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
            metadata: {
              createdDate: '2021-02-03T03:26:45.759+00:00',
              updatedDate: '2021-02-03T03:26:45.759+00:00',
            },
            reportEditedManually: false,
            editReason: '',
          },
          {
            id: '2433dfef-47de-48ac-8124-869329363ec2',
            downloadTime: '2019-04-12T13:33:32.919+00:00',
            release: '4',
            reportName: 'JR1',
            yearMonth: '2018-03',
            providerId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
            metadata: {
              createdDate: '2021-02-03T03:26:45.796+00:00',
              updatedDate: '2021-02-03T03:26:45.796+00:00',
            },
          },
        ],
      },
    ],
  },
];

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

const data = {
  counterReports: stubCounterReports,
  customReports: [],
  harvesterImpls: stubHarvesterImpls,
  settings: stubSettings,
  usageDataProvider: stubUDP,
};

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
  onDownloadReportMultiMonth: jest.fn,
};

const mutators = {
  udpReloadToggle: {
    replace: jest.fn,
  },
  statsReloadToggle: {
    replace: jest.fn,
  },
};

const renderUDP = (stripes) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <UDP
          data={data}
          stripes={stripes}
          handlers={handlers}
          isHarvesterExistent={false}
          isLoading={false}
          isStatsLoading={false}
          mutator={mutators}
          statsReloadCount={0}
          tagsEnabled={false}
          udpReloadCount={0}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('UDP', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render UDP', () => {
    renderUDP(stripes);
    userEvent.click(screen.getByText('Harvesting configuration'));

    // TODO: Harvesting status is always visible. How to test the accordion?
    expect(screen.getByText('Harvesting status')).toBeVisible();
  });
});
