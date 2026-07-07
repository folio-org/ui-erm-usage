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
  EntryManager: jest.fn(() => <div data-testid="entry-manager" />),
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

    expect(screen.getByTestId('entry-manager')).toBeInTheDocument();

    expect(EntryManager).toHaveBeenCalledWith(
      expect.objectContaining({
        parentMutator: defaultProps.mutator,
        entryList: [
          { label: 'Entry A' },
          { label: 'Entry B' },
        ],
        detailComponent: expect.any(Function),
        entryFormComponent: expect.any(Function),
        paneTitle: 'Test Label',
        entryLabel: 'Test Label',
        nameKey: 'label',
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
    EntryManager.mockImplementation(() => <div data-testid="entry-manager" />);
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

    await userEvent.click(screen.getByRole('link', { name: aggregator.label }));
    await userEvent.click(screen.getByRole('button', { name: /Actions/ }));

    expect(screen.getByRole('button', { name: /Duplicate/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
  });
});
