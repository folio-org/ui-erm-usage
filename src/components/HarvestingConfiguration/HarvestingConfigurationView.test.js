import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';

import HarvestingConfigurationView from './HarvestingConfigurationView';

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

const usageDataProviderAggregator = {
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

const onToggle = jest.fn;

const renderHarvestingConfigurationView = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        usageDataProvider={usageDataProviderAggregator}
        stripes={stripes}
        onToggle={onToggle}
        settings={settings}
        harvesterImpls={harvesterImpls}
      />
    </MemoryRouter>
  );
};

describe('HarvestingConfigurationView', () => {
  xtest('should render HarvestingConfigurationView', async () => {
    const { getByText } = await renderHarvestingConfigurationView();
    screen.debug();
    expect(getByText('Harvesting status')).toBeVisible();
  });
});
