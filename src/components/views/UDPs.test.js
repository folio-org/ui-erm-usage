import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
// import { screen } from '@testing-library/react';
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

jest.unmock('@folio/stripes/components');
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

// const mockTotalCount = jest.fn();
// jest.mock('@folio/stripes-smart-components/lib/SearchAndSort/ConnectedSource/StripesConnectedSource', () => {
//   return jest.fn().mockImplementation(() => {
//     return { totalCount: mockTotalCount };
//   });
// });

const testUDP = {
  logger: { log: noop },
  mutator: { sources: {}, query: {}, resultCount: {} },
  props: {
    history: {},
    location: {},
    match: {},
    staticContext: undefined,
    children: {},
    // hier isPending, muss zuerst true sein und dann für den Fokus FALSE!!!!
    resources: { usageDataProviders: { hasLoaded: true, other: { totalRecords: 2 }, isPending: true } },
  },
  recordsObj: {
    other: { totalRecords: 1 },
  },
  resources: {
    usageDataProviders: {
      hasLoaded: true,
      isPending: false,
      loadedAt: { },
      other: { totalRecords: 1 },
      pendingMutations: [],
      resource: 'usageDataProviders',
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
              name: 'Huhu',
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
      ],
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

const onSearchComplete = jest.fn();
const history = {};

// liste darf nicht initial erzeugt werden, weil der initiale state ein anderer sein muss
// UDPs mit den records darf erst beim Klick auf den Suchbutton gerendert werden, sonst ist der prevState falsch
const renderUDPs = (stripes) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider module="@folio/erm-usage">
        <UDPs
          data={{
            udps: [udp],
            aggregators: [aggregator],
            tags: [],
            errorCodes: ['3030', '3031', 'other'],
            reportTypes: ['BR', 'TR'],
          }}
          selectedRecordId={''}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'status.active'}
          source={connectedTestSource}
          visibleColumns={['label', 'harvestingStatus', 'Latest statistics', 'aggregator']}
          history={history}
          onSearchComplete={onSearchComplete}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </MemoryRouter>
);

const renderUDPsWithoutResults = (stripes) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider module="@folio/erm-usage">
        <UDPs
          data={{
            udps: [],
            aggregators: [aggregator],
            tags: [],
            errorCodes: ['3030', '3031', 'other'],
            reportTypes: ['BR', 'TR'],
          }}
          selectedRecordId={''}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'status.active'}
          source={connectedTestSource}
          visibleColumns={['label', 'harvestingStatus', 'Latest statistics', 'aggregator']}
          history={history}
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

      expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.queryByText('American Chemical Society')).toBeInTheDocument();
      expect(document.querySelector('[data-test-pane-header]')).toBeInTheDocument();

      // hier:
      expect(document.querySelector('#paneHeaderpane-list-udps')).toHaveFocus();

      // document.querySelector('[data-test-pane-header]').focus();
      // expect(document.querySelector('[data-test-pane-header]')).toHaveFocus();
      // await waitFor(() => expect(onSearchComplete).toHaveBeenCalled());

      // await act(async () => expect(document.querySelector('#paneHeaderpane-list-udps')).toHaveFocus());
      // await waitFor(() => expect(document.querySelector('[data-test-pane-header]')).toHaveFocus());
      // await waitFor(() => expect(document.querySelector('#paneHeaderpane-list-udps')).toHaveFocus());

      // expect focus in result list ////////////////////////////////////////////////////

      // NOT WORKING ////////////////////////////////////////////
      // await (waitFor(() => document.querySelector('[data-test-pane-header]').toHaveFocus()));
      // await waitFor(() => expect(document.querySelector('[data-test-pane-header]')).toHaveFocus());
      // await new Promise((r) => setTimeout(r, 2000));

      // jest.setTimeout(20000);
      // expect(document.querySelector('[data-test-pane-header]')).toHaveFocus();

      // await act(async () => expect(document.querySelector('[data-test-pane-header]')).toHaveFocus());
    });

    test('check columns of MCL', async () => {
      const searchFieldInput = document.querySelector('#input-udp-search');
      expect(searchFieldInput).toBeInTheDocument();
      userEvent.type(searchFieldInput, 'American');

      expect(document.querySelector('#clickable-search-udps')).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(screen.queryByText('Provider name')).toBeInTheDocument();
      expect(document.querySelector('#clickable-list-column-harvestingstatus')).toBeInTheDocument();
      expect(screen.queryByText('Latest statistics')).toBeInTheDocument();
      expect(document.querySelector('#list-column-aggregator')).toBeInTheDocument();
    });
  });
});

describe('UDPs SASQ View - Without results', () => {
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

    renderUDPsWithoutResults(stripes);
  });

  test('enter search string', async () => {
    const searchFieldInput = document.querySelector('#input-udp-search');
    expect(searchFieldInput).toBeInTheDocument();
    userEvent.type(searchFieldInput, 'American');

    expect(document.querySelector('#clickable-search-udps')).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(0);
    expect(document.querySelector('[data-test-pane-header]')).not.toHaveFocus();
    // expect(document.querySelector('#paneHeaderpane-list-udps')).not.toHaveFocus();
    // expect(document.querySelector('#clickable-search-udps')).toHaveFocus();
  });
});
