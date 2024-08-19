import { screen } from '@testing-library/react';

import { EntryManager } from '@folio/stripes/smart-components';

import AggregatorManager from './AggregatorManager';
import renderWithIntl from '../../../test/jest/helpers';

jest.mock('@folio/stripes/smart-components', () => ({
  EntryManager: jest.fn(() => <div data-testid="entry-manager" />),
}));

describe('AggregatorManager', () => {
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
