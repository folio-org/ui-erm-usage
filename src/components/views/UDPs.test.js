import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  ModuleHierarchyProvider,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import udps from '../../../test/fixtures/udps';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import UDPs from './UDPs';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const onSearchComplete = jest.fn();
const history = {};

let renderWithIntlResult = {};
const sourcePending = {
  source: {
    pending: jest.fn(() => true),
    totalCount: jest.fn(() => 0),
    loaded: jest.fn(() => false),
  },
};
const sourceLoaded = {
  source: {
    pending: jest.fn(() => false),
    totalCount: jest.fn(() => 1),
    loaded: jest.fn(() => true),
  },
};

// rerender result list for generate correct state and prevState of recordsArePending
// trigger a new list of results: source isPending has to be TRUE first, than FALSE
const renderUDPs = (stripes, props, udpsData, rerender) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider module="@folio/erm-usage">
        <UDPs
          data={{
            udps: udpsData,
            tags: [],
            errorCodes: ['3030', '3031', 'other'],
            reportTypes: ['BR', 'TR'],
            reportReleases: ['5.0', '4'],
            serviceTypes: ['cs41', 'cs51'],
            harvesterImpls: [{ implementations: [{ type: 'cs51', name: 'Counter 5.1' }] }],
          }}
          history={history}
          location={{ pathname: '', search: '' }}
          onNeedMoreData={jest.fn()}
          onSearchComplete={onSearchComplete}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="status.active"
          selectedRecordId=""
          visibleColumns={['label', 'reportReleases', 'harvestingStatus', 'Latest statistics']}
          {...props}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </MemoryRouter>,
  rerender
);

// MultiSelection uses window.matchMedia, which jsdom does not provide
beforeEach(() => {
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

const openServiceTypesList = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Service types filter list' }));
  const multiselects = screen.getAllByLabelText('open menu');
  await userEvent.click(
    multiselects.find(btn => btn.getAttribute('aria-controls') === 'multiselect-option-list-filter-serviceTypes')
  );

  return screen.getAllByRole('listbox')
    .find(ul => ul.getAttribute('id') === 'multiselect-option-list-filter-serviceTypes');
};

describe('rerender result list', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('trigger search with loading new results', () => {
    it('should set the focus to the result list', async () => {
      renderWithIntlResult = renderUDPs(stripes, sourcePending, udps);
      expect(screen.getByRole('region', { name: /Usage data providers/ })).toBeInTheDocument();

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
      expect(screen.getByText('5.0, 4')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /Usage data providers/ })).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /Usage data providers/ })).toHaveFocus();
    });
  });
});

describe('UDPs SASQ View', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

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

    it('should be present the report types filter', () => {
      expect(screen.getByRole('button', { name: 'Report types filter list' })).toBeInTheDocument();
    });

    it('should be present the report releases filter', () => {
      expect(screen.getByRole('button', { name: 'Report releases filter list' })).toBeInTheDocument();
    });

    it('should be present the service types filter', () => {
      expect(screen.getByRole('button', { name: 'Service types filter list' })).toBeInTheDocument();
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
      const multiselectReportReleases =
        multiselects.find(btn => btn.getAttribute('aria-controls') === 'multiselect-option-list-filter-reportReleases');
      expect(multiselectReportReleases).toBeInTheDocument();
      await userEvent.click(multiselectReportReleases);

      const listboxes = screen.getAllByRole('listbox');
      const reportReleasesList =
        listboxes.find(ul => ul.getAttribute('id') === 'multiselect-option-list-filter-reportReleases');
      expect(within(reportReleasesList).getByRole('option', { name: /5.0/ })).toBeInTheDocument();
      expect(within(reportReleasesList).getByRole('option', { name: /4/ })).toBeInTheDocument();
      await userEvent.click(within(reportReleasesList).getByRole('option', { name: /4/ }));

      const searchboxes = screen.getAllByRole('searchbox');
      const searchboxReportReleases =
        searchboxes.find(
          btn => btn.getAttribute('aria-describedby') === 'multi-describe-control-filter-reportReleases'
        );
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
      expect(document.querySelector('#clickable-list-column-reportreleases')).toBeInTheDocument();
    });
  });
});

describe('UDPs SASQ View - Service types filter', () => {
  let stripes;
  const querySetter = jest.fn();

  beforeEach(() => {
    stripes = useStripes();

    renderUDPs(stripes, { ...sourceLoaded, querySetter }, udps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should offer labelled service types and "No service type" and apply the selection', async () => {
    const serviceTypesList = await openServiceTypesList();
    expect(within(serviceTypesList).getAllByRole('option')).toHaveLength(3);
    expect(within(serviceTypesList).getByRole('option', { name: /^cs41 \(Unsupported\)/ })).toBeInTheDocument();
    expect(within(serviceTypesList).getByRole('option', { name: /^Counter 5\.1/ })).toBeInTheDocument();
    expect(within(serviceTypesList).getByRole('option', { name: /^No service type/ })).toBeInTheDocument();

    await userEvent.click(within(serviceTypesList).getByRole('option', { name: /cs41/ }));

    expect(querySetter).toHaveBeenLastCalledWith(expect.objectContaining({
      nsValues: expect.objectContaining({ filters: expect.stringContaining('serviceTypes.cs41') }),
    }));
  });
});

describe('UDPs SASQ View - Service types filter without harvester implementations', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should show the plain codes until the implementations are loaded and then update the labels', async () => {
    const data = (harvesterImpls) => ({
      data: {
        udps,
        tags: [],
        errorCodes: [],
        reportTypes: [],
        reportReleases: [],
        serviceTypes: ['cs41', 'cs51'],
        harvesterImpls,
      },
    });
    const { rerender } = renderUDPs(stripes, { ...sourceLoaded, ...data([]) }, udps);

    let serviceTypesList = await openServiceTypesList();
    expect(within(serviceTypesList).getByRole('option', { name: /^cs41/ })).toBeInTheDocument();
    expect(within(serviceTypesList).getByRole('option', { name: /^cs51/ })).toBeInTheDocument();
    expect(within(serviceTypesList).queryByRole('option', { name: /Unsupported/ })).not.toBeInTheDocument();

    renderUDPs(
      stripes,
      { ...sourceLoaded, ...data([{ implementations: [{ type: 'cs51', name: 'Counter 5.1' }] }]) },
      udps,
      rerender
    );

    serviceTypesList = screen.getAllByRole('listbox')
      .find(ul => ul.getAttribute('id') === 'multiselect-option-list-filter-serviceTypes');
    expect(within(serviceTypesList).getByRole('option', { name: /^cs41 \(Unsupported\)/ })).toBeInTheDocument();
    expect(within(serviceTypesList).getByRole('option', { name: /^Counter 5\.1/ })).toBeInTheDocument();
  });
});

describe('UDPs SASQ View - Without results', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

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
    expect(screen.getByRole('region', { name: /Usage data providers/ })).not.toHaveFocus();
  });
});
