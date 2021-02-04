import React from 'react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';

import UDP from './UDP';

const stripes = {
  actionNames: [],
  clone: () => ({ ...stripes }),
  connect: () => {},
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => {},
  setCurrency: () => {},
  setLocale: () => {},
  setSinglePlugin: () => {},
  setTimezone: () => {},
  setToken: () => {},
  store: {
    getState: () => ({
      okapi: {
        token: 'abc',
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

const usageDataProvider = {
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

const counterReports = [
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

const harvesterImpls = [
  {
    value: 'cs41',
    label: 'Counter Sushi 4.1',
  },
];

const settings = [
  {
    id: '38d7d9ae-95aa-4134-91b0-4ddbd9143fa7',
    module: 'ERM-USAGE',
    configName: 'hide_credentials',
    enabled: true,
    value: 'true',
  },
];

const data = {
  counterReports,
  customReports: [],
  harvesterImpls,
  settings,
  usageDataProvider,
};

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
  onDownloadReportMultiMonth: jest.fn
};

const renderUDP = () => {
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
          tagsEnabled={false}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('UDP', () => {
  test('should render UDP', () => {
    const { getByText } = renderUDP();
    userEvent.click(getByText('Harvesting configuration'));

    // TODO: Harvesting status is always visible. How to test the accordion?
    expect(getByText('Harvesting status')).toBeVisible();
  });
});
