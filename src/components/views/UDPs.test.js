import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';
// import { Accordion, MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import udp from '../../../test/fixtures/udp';
import aggregator from '../../../test/fixtures/aggregator';
import UDPs from './UDPs';

const testUDP = {
  logger: { log: noop },
  mutator: { sources: {}, query: {}, resultCount: {} },
  props: {
    history: {},
    location: {},
    match: {},
    staticContext: undefined,
    children: {},
  },
  recordsObj: {},
  resources: {
    usageDataProviders: {
      records: [
        {
          id: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
          label: 'American Chemical Society',
          description: 'This is a mock udp',
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
            apiKey: 'api123',
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
        }
      ]
    },
    aggregatorSettings: {},
    harvesterImpls: {},
    errorCodes: {},
    reportTypes: {},
    query: { query: '', filters: 'status.active', sort: 'label' },
    resultCount: 30,
  },
};

const connectedTestSource = new StripesConnectedSource(
  testUDP.props,
  testUDP.logger,
  'usageDataProviders'
);

// const columnMapping = {
//   label: 'Label',
//   harvestingStatus: 'Harvesting status',
//   latestStats: 'Latest statistics',
//   aggregator: 'Aggregator',
// };

// const columnWidths = {
//   label: 300,
//   harvestingStatus: 150,
//   latestStats: 150,
//   aggregator: 200,
// };

const renderUDPs = (stripes) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider value={['@folio/erm-usage']}>
        <UDPs
          data={{
            udps: [udp],
            aggregators: [aggregator],
            tags: [],
            errorCodes: ['3030', '3031', 'other'],
            reportTypes: ['BR', 'TR'],
          }}
          usageDataProviders={[udp]}
          selectedRecordId={''}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'status.active'}
          source={connectedTestSource}
          visibleColumns={['label', 'harvestingStatus', 'Latest statistics', 'aggregator']}
          history={''}
          contentData={[udp]}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </MemoryRouter>
);

describe('UDPs SASQ View', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderUDPs(stripes);
    // jest.setTimeout(400000);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane sourceresults should be visible', () => {
    expect(screen.getByText('Usage data providers')).toBeVisible();
  });

  describe('check filters', () => {
    it('harvesting status filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-harvestingStatus')
      ).toBeInTheDocument();
    });

    it('harvestVia filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-harvestVia')
      ).toBeInTheDocument();
    });

    it('aggregators filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-aggregators')
      ).toBeInTheDocument();
    });

    it('report types filter should be present', () => {
      expect(
        document.querySelector('#clickable-report-types-filter')
      ).toBeInTheDocument();
    });

    it('has failed reports filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-hasFailedReport')
      ).toBeInTheDocument();
    });

    it('error codes filter should be present', () => {
      expect(
        document.querySelector('#clickable-error-codes-filter')
      ).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(
        document.querySelector('#clickable-reset-all')
      ).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#input-udp-search')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#clickable-search-udps')).toBeInTheDocument();
    });

    test('enter search string', async () => {
      const searchFieldInput = document.querySelector('#input-udp-search');
      expect(searchFieldInput).toBeInTheDocument();
      userEvent.type(searchFieldInput, 'American');

      expect(document.querySelector('#clickable-search-udps')).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(searchFieldInput.value).toBe('American');
      expect(document.querySelector('[data-test-pane-header]')).toBeInTheDocument();

      // expect focus in result list ////////////////////////////////////////////////////

      // WORKING when focus is set manually: /////////////////////
      // document.querySelector('[data-test-pane-header]').focus();
      // expect(document.querySelector('[data-test-pane-header]')).toHaveFocus();

      // NOT WORKING ////////////////////////////////////////////
      // await (waitFor(() => document.querySelector('[data-test-pane-header]').toHaveFocus()));
      // await waitFor(() => expect(document.querySelector('[data-test-pane-header]')).toHaveFocus());

      // await new Promise((r) => setTimeout(r, 2000));

      // jest.setTimeout(20000);
      // expect(document.querySelector('[data-test-pane-header]')).toHaveFocus();

      // await act(async () => expect(document.querySelector('[data-test-pane-header]')).toHaveFocus());
    });

    // render result list:
    it('render no result message', () => {
      expect(screen.getByText('Loading…')).toBeVisible();
      expect(document.querySelector('.noResultsMessage')).toBeInTheDocument();
    });
  });

  // TODO: list of results will not rendered yet
});
