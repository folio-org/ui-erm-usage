import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ModuleHierarchyProvider, StripesContext, useStripes } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import udps from '../../../test/fixtures/udps';
import aggregator from '../../../test/fixtures/aggregator';
import UDPs from './UDPs';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const onSearchComplete = jest.fn();
const history = {};

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

// rerender result list for generate correct state and prevState of recordsArePending
// trigger a new list of results: source isPending has to be TRUE first, than FALSE
const renderUDPs = (stripes, props, udpsData, rerender) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider module="@folio/erm-usage">
        <UDPs
          data={{
            udps: udpsData,
            aggregators: [aggregator],
            tags: [],
            errorCodes: ['3030', '3031', 'other'],
            reportTypes: ['BR', 'TR'],
          }}
          selectedRecordId=""
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="status.active"
          visibleColumns={['label', 'harvestingStatus', 'Latest statistics', 'aggregator']}
          history={history}
          onSearchComplete={onSearchComplete}
          location={{ pathname: '', search: '' }}
          {...props}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </MemoryRouter>,
  rerender
);

describe('rerender result list', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  describe('trigger search with loading new results', () => {
    it('should set the focus to the result list', async () => {
      renderWithIntlResult = renderUDPs(stripes, sourcePending, udps);
      expect(document.querySelector('#paneHeaderpane-list-udps')).toBeInTheDocument();

      const searchFieldInput = document.querySelector('#input-udp-search');
      await userEvent.type(searchFieldInput, 'American');

      expect(document.querySelector('#clickable-search-udps')).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      renderUDPs(
        stripes,
        sourceLoaded,
        udps,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.getByText('American Chemical Society')).toBeInTheDocument();
      expect(document.querySelector('[data-test-pane-header]')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(document.querySelector('#paneHeaderpane-list-udps')).toHaveFocus();
    });
  });
});

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

    renderUDPs(stripes, sourceLoaded, udps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane sourceresults should be visible', () => {
    expect(screen.getByText('Usage data providers')).toBeVisible();
  });

  describe('check filters', () => {
    it('harvesting status filter should be present', () => {
      expect(document.querySelector('#filter-accordion-harvestingStatus')).toBeInTheDocument();
    });

    it('harvestVia filter should be present', () => {
      expect(document.querySelector('#filter-accordion-harvestVia')).toBeInTheDocument();
    });

    it('aggregators filter should be present', () => {
      expect(document.querySelector('#filter-accordion-aggregators')).toBeInTheDocument();
    });

    it('report types filter should be present', () => {
      expect(document.querySelector('#clickable-report-types-filter')).toBeInTheDocument();
    });

    it('has failed reports filter should be present', () => {
      expect(document.querySelector('#filter-accordion-hasFailedReport')).toBeInTheDocument();
    });

    it('error codes filter should be present', () => {
      expect(document.querySelector('#clickable-error-codes-filter')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#input-udp-search')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#clickable-search-udps')).toBeInTheDocument();
    });

    it('columns of MCL should be present', async () => {
      const searchFieldInput = document.querySelector('#input-udp-search');
      expect(searchFieldInput).toBeInTheDocument();
      await userEvent.type(searchFieldInput, 'American');

      expect(document.querySelector('#clickable-search-udps')).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(screen.getByText('Provider name')).toBeInTheDocument();
      expect(document.querySelector('#clickable-list-column-harvestingstatus')).toBeInTheDocument();
      expect(screen.getByText('Latest statistics')).toBeInTheDocument();
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

    renderUDPs(stripes, {}, []);
  });

  test('enter search string', async () => {
    const searchFieldInput = document.querySelector('#input-udp-search');
    expect(searchFieldInput).toBeInTheDocument();
    await userEvent.type(searchFieldInput, 'American');

    expect(document.querySelector('#clickable-search-udps')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(document.querySelectorAll('#list-udps .mclRowContainer > [role=row]').length).toEqual(0);
    expect(document.querySelector('[data-test-pane-header]')).not.toHaveFocus();
  });
});
