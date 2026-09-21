import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  CalloutContext,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';
import { EntryManager } from '@folio/stripes/smart-components';

import aggregator from '../../../test/fixtures/aggregator';
import renderWithIntl from '../../../test/jest/helpers';
import AggregatorManager from './AggregatorManager';

const ActualEntryManager = jest.requireActual('@folio/stripes/smart-components').EntryManager;

jest.mock('@folio/stripes/smart-components', () => ({
  EntryManager: jest.fn(() => <div />),
}));

const defaultProps = {
  label: 'Test Label',
  resources: {
    entries: {
      records: [
        { label: 'Entry A' },
        { label: 'Entry B' },
      ],
    },
    aggregatorImpls: {
      records: [
        {
          implementations: [
            { type: 'type1', name: 'Implementation 1' },
            { type: 'type2', name: 'Implementation 2' },
          ],
        },
      ],
    },
  },
  mutator: {
    entries: {
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
  },
};

describe('AggregatorManager', () => {
  it('should render AggregatorManager and EntryManager', () => {
    renderWithIntl(<AggregatorManager {...defaultProps} />);

    expect(EntryManager).toHaveBeenCalledWith(
      expect.objectContaining({
        parentMutator: defaultProps.mutator,
        entryList: [
          { label: 'Entry A', displayLabel: 'Entry A' },
          { label: 'Entry B', displayLabel: 'Entry B' },
        ],
        detailComponent: expect.any(Function),
        entryFormComponent: expect.any(Function),
        paneTitle: 'Test Label',
        entryLabel: 'Test Label',
        nameKey: 'displayLabel',
        permissions: {
          put: 'ui-erm-usage.generalSettings.manage',
          post: 'ui-erm-usage.generalSettings.manage',
          delete: 'ui-erm-usage.generalSettings.manage',
        },
        aggregators: [
          { value: 'type1', label: 'Implementation 1' },
          { value: 'type2', label: 'Implementation 2' },
        ],
      }),
      {}
    );
  });

  it('should handle empty entries and aggregatorImpls', () => {
    const emptyProps = {
      ...defaultProps,
      resources: {
        entries: { records: [] },
        aggregatorImpls: { records: [] },
      },
    };

    renderWithIntl(<AggregatorManager {...emptyProps} />);

    expect(EntryManager).toHaveBeenCalledWith(
      expect.objectContaining({
        entryList: [],
        aggregators: [],
      }),
      {}
    );
  });

  it('should handle empty lists', () => {
    const missingResourcesProps = {
      ...defaultProps,
      resources: {},
    };

    renderWithIntl(<AggregatorManager {...missingResourcesProps} />);

    expect(EntryManager).toHaveBeenCalledWith(
      expect.objectContaining({
        entryList: [],
        aggregators: [],
      }),
      {}
    );
  });
});

describe('AggregatorManager unsupported service type', () => {
  const renderWithEntries = (entries) => {
    renderWithIntl(
      <AggregatorManager
        {...defaultProps}
        resources={{
          ...defaultProps.resources,
          entries: { records: entries },
        }}
      />
    );
    return EntryManager.mock.calls.at(-1)[0];
  };

  it('should add (Unsupported) to displayLabel of entries with unsupported service type', () => {
    const { entryList } = renderWithEntries([
      { label: 'Supported', serviceType: 'type1' },
      { label: 'Unsupported', serviceType: 'NSS' },
    ]);

    expect(entryList).toEqual([
      { label: 'Supported', serviceType: 'type1', displayLabel: 'Supported' },
      { label: 'Unsupported', serviceType: 'NSS', displayLabel: 'Unsupported (Unsupported)' },
    ]);
  });

  it('should not add (Unsupported) while aggregator implementations are not loaded', () => {
    renderWithIntl(
      <AggregatorManager
        {...defaultProps}
        resources={{
          entries: { records: [{ label: 'Agg', serviceType: 'NSS' }] },
          aggregatorImpls: { records: [] },
        }}
      />
    );
    const { entryList } = EntryManager.mock.calls.at(-1)[0];

    expect(entryList[0].displayLabel).toBe('Agg');
  });

  it('should remove displayLabel before saving and when editing', () => {
    const { onBeforeSave, parseInitialValues } = renderWithEntries([]);
    const entry = { label: 'Agg', serviceType: 'NSS', displayLabel: 'Agg (Unsupported)' };

    expect(onBeforeSave(entry)).not.toHaveProperty('displayLabel');
    expect(onBeforeSave(entry).label).toBe('Agg');
    expect(parseInitialValues(entry)).not.toHaveProperty('displayLabel');
    expect(parseInitialValues(entry).label).toBe('Agg');
  });
});

describe('Aggregator action menu', () => {
  // Smoke test with the real EntryManager (not the stub above): confirms
  // that our wiring (enableDetailsActionMenu + the put/post/delete
  // permissions) actually produces a Duplicate/Edit/Delete action menu.
  const actionMenuProps = {
    ...defaultProps,
    resources: {
      ...defaultProps.resources,
      entries: { records: [aggregator] },
    },
  };

  beforeEach(() => {
    EntryManager.mockImplementation((props) => <ActualEntryManager {...props} />);

    // EntryManager's Layer portals into #ModuleContainer, which must
    // already exist in the DOM before the first render commits.
    document.body.appendChild(Object.assign(document.createElement('div'), { id: 'ModuleContainer' }));
  });

  afterEach(() => {
    EntryManager.mockImplementation(() => <div />);
    document.getElementById('ModuleContainer')?.remove();
  });

  test('offers duplicate, edit and delete', async () => {
    const stripes = useStripes();

    renderWithIntl(
      <StripesContext.Provider value={stripes}>
        <CalloutContext.Provider value={{ sendCallout: jest.fn() }}>
          <MemoryRouter initialEntries={['/']}>
            <AggregatorManager
              {...actionMenuProps}
              stripes={stripes}
            />
          </MemoryRouter>
        </CalloutContext.Provider>
      </StripesContext.Provider>
    );

    // aggregator fixture has service type NSS, which is not part of the stubbed implementations
    await userEvent.click(screen.getByRole('link', { name: `${aggregator.label} (Unsupported)` }));
    await userEvent.click(screen.getByRole('button', { name: /Actions/ }));

    expect(screen.getByRole('button', { name: /Duplicate/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
  });
});
