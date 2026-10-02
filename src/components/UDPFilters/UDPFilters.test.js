import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../../../test/jest/helpers';
import UDPFilters from './UDPFilters';

const activeFilters = {
  status: ['active'],
  harvestingStatus: [],
  hasFailedReport: [],
};

const data = {
  errorCodes: [],
  reportReleases: ['5'],
  reportTypes: ['TR', 'DR'],
  tags: [],
};

const filterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderUDPFilters = (props = {}) => renderWithIntl(
  <UDPFilters
    activeFilters={activeFilters}
    data={data}
    filterHandlers={filterHandlers}
    {...props}
  />
);

describe('UDPFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  describe('filter accordions', () => {
    it('should render all filter accordions', () => {
      renderUDPFilters();

      expect(screen.getByText('Provider status')).toBeInTheDocument();
      expect(screen.getByText('Harvesting status')).toBeInTheDocument();
      expect(screen.getByText('Report types')).toBeInTheDocument();
      expect(screen.getByText('Report releases')).toBeInTheDocument();
      expect(screen.getByText('Has failed report(s)')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Error codes')).toBeInTheDocument();
    });

    it('should open the provider and harvesting status accordions by default', () => {
      renderUDPFilters();

      expect(screen.getByRole('button', { name: 'Provider status filter list' }))
        .toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: 'Harvesting status filter list' }))
        .toHaveAttribute('aria-expanded', 'true');
    });

    it('should close the has failed report accordion by default', () => {
      renderUDPFilters();

      expect(screen.getByRole('button', { name: 'Has failed report(s) filter list' }))
        .toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('checkbox filters', () => {
    it('should show the selected values of a filter group', () => {
      renderUDPFilters();

      const accordion = screen.getByRole('region', { name: 'Provider status filter list' });
      expect(within(accordion).getByRole('checkbox', { name: 'Active' })).toBeChecked();
      expect(within(accordion).getByRole('checkbox', { name: 'Inactive' })).not.toBeChecked();
    });

    it('should update the filter state when a checkbox is clicked', async () => {
      renderUDPFilters();

      const accordion = screen.getByRole('region', { name: 'Harvesting status filter list' });
      await userEvent.click(within(accordion).getByRole('checkbox', { name: 'Inactive' }));

      expect(filterHandlers.state).toHaveBeenCalledWith({ ...activeFilters, harvestingStatus: ['inactive'] });
    });

    it('should clear a filter group with the clear button', async () => {
      renderUDPFilters();

      await userEvent.click(screen.getByRole('button', { name: /Clear selected Provider status filters/ }));

      expect(filterHandlers.clearGroup).toHaveBeenCalledWith('status');
    });

    it('should show no clear button for a filter group without selected values', () => {
      renderUDPFilters();

      expect(screen.queryByRole('button', { name: /Clear selected Harvesting status filters/ }))
        .not.toBeInTheDocument();
    });
  });
});
