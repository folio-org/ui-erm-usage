import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
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
            reportReleases: ['5.0', '4'],
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
    it('should be present the provider status filter', () => {
      expect(screen.getByRole('button', { name: 'Provider status filter list' })).toBeInTheDocument();
    });

    it('should be present the harvesting status filter', () => {
      expect(screen.getByRole('button', { name: 'Harvesting status filter list' })).toBeInTheDocument();
    });

    it('should be present the harvestVia filter', () => {
      expect(screen.getByRole('button', { name: 'Harvest via filter list' })).toBeInTheDocument();
    });

    it('should be present the aggregators filter', () => {
      expect(screen.getByRole('button', { name: 'Aggregators filter list' })).toBeInTheDocument();
    });

    it('should be present the report types filter', () => {
      expect(screen.getByRole('button', { name: 'Report types filter list' })).toBeInTheDocument();
    });

    it('should be present the report releases filter', () => {
      expect(screen.getByRole('button', { name: 'Report releases filter list' })).toBeInTheDocument();
    });

    it('should be present the has failed reports filter', () => {
      expect(screen.getByRole('button', { name: 'Has failed report(s) filter list' })).toBeInTheDocument();
    });

    it('should be present the tags filter', () => {
      expect(screen.getByRole('button', { name: 'Tags filter list' })).toBeInTheDocument();
    });

    it('should be present the error codes filter', () => {
      expect(screen.getByRole('button', { name: 'Error codes filter list' })).toBeInTheDocument();
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

    test('select and clear report release filter values', async () => {
      const reportReleaseAccordion = screen.getByRole('button', { name: 'Report releases filter list' });
      expect(reportReleaseAccordion).toBeInTheDocument();
      await userEvent.click(reportReleaseAccordion);

      const multiselects = screen.getAllByLabelText('open menu');
      const multiselectReportReleases = multiselects.find(btn => btn.getAttribute('aria-controls') === 'multiselect-option-list-filter-reportReleases');
      expect(multiselectReportReleases).toBeInTheDocument();
      await userEvent.click(multiselectReportReleases);

      const listboxes = screen.getAllByRole('listbox');
      const reportReleasesList = listboxes.find(ul => ul.getAttribute('id') === 'multiselect-option-list-filter-reportReleases');
      expect(within(reportReleasesList).getByRole('option', { name: /5.0/ })).toBeInTheDocument();
      expect(within(reportReleasesList).getByRole('option', { name: /4/ })).toBeInTheDocument();
      await userEvent.click(within(reportReleasesList).getByRole('option', { name: /4/ }));

      const searchboxes = screen.getAllByRole('searchbox');
      const searchboxReportReleases = searchboxes.find(btn => btn.getAttribute('aria-describedby') === 'multi-describe-control-filter-reportReleases');
      expect(searchboxReportReleases).toBeInTheDocument();
      expect(within(searchboxReportReleases).getByText('4')).toBeInTheDocument();
      expect(within(searchboxReportReleases).queryByText('5.0')).not.toBeInTheDocument();

      const clearReportReleasesButton = screen.getByRole('button', { name: /Clear selected Report releases filters/i });
      expect(clearReportReleasesButton).toBeInTheDocument();
      await userEvent.click(clearReportReleasesButton);

      expect(within(searchboxReportReleases).queryByText('4')).not.toBeInTheDocument();
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
