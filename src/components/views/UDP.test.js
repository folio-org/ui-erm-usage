import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import UDP from './UDP';
import stubUDP from '../../../test/fixtures/udp';
import counterReports from '../../../test/fixtures/counterReports';
import harvesterImpls from '../../../test/fixtures/harvesterImpls';
import settings from '../../../test/fixtures/settings';

const data = {
  counterReports,
  customReports: [],
  harvesterImpls,
  settings,
  usageDataProvider: stubUDP,
};

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
  onDownloadReportMultiMonth: jest.fn,
};

const mutators = {
  udpReloadToggle: {
    replace: jest.fn,
  },
  statsReloadToggle: {
    replace: jest.fn,
  },
};

jest.mock('../HarvestingConfiguration/AggregatorInfo/AggregatorContactInfo', () => {
  return () => <span>AggregatorContactInfo</span>;
});

const renderUDP = (stripes) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <UDP
          data={data}
          stripes={stripes}
          handlers={handlers}
          isHarvesterExistent={false}
          isLoading={false}
          isStatsLoading={false}
          mutator={mutators}
          statsReloadCount={0}
          tagsEnabled={false}
          udpReloadCount={0}
          location={{}}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('UDP', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render UDP', async () => {
    renderUDP(stripes);

    const harvestingAccordion = screen.getByRole('region', { name: /Harvesting configuration/ });
    expect(harvestingAccordion).not.toHaveClass('expanded');

    await userEvent.click(screen.getByText('Harvesting configuration'));
    expect(harvestingAccordion).toHaveClass('expanded');
  });

  test('should render action menu button', async () => {
    renderUDP(stripes);
    expect(screen.getByText('Actions')).toBeVisible();
  });

  describe('test action menu', () => {
    beforeEach(async () => {
      renderUDP(stripes);
      await userEvent.click(screen.getByText('Actions'));
    });

    test('should render action menu with actions', async () => {
      expect(screen.getByText('Start harvester')).toBeVisible();
      expect(screen.getByText('Show harvester logs')).toBeVisible();
      expect(screen.getByText('Refresh statistics table')).toBeVisible();
      expect(screen.getByText('Upload COUNTER report')).toBeVisible();
      expect(screen.getByText('Upload non-COUNTER report')).toBeVisible();
      expect(screen.getByText('Delete reports')).toBeVisible();
    });

    test('should render Expand all', async () => {
      expect(screen.getByText('Expand all')).toBeVisible();
      await userEvent.click(screen.getByText('Expand all'));
      expect(screen.getByText('Collapse all')).toBeVisible();
    });

    test('click upload counter report', async () => {
      await userEvent.click(screen.getByText('Upload COUNTER report'));
      const heading = screen.getByRole('heading', { name: 'Upload COUNTER report' });
      expect(heading).toBeInTheDocument();
    });

    test('click upload non-counter report', async () => {
      await userEvent.click(screen.getByText('Upload non-COUNTER report'));
      const heading = screen.getByRole('heading', { name: 'Upload non-COUNTER report' });
      expect(heading).toBeInTheDocument();
    });

    test('click delete reports', async () => {
      await userEvent.click(screen.getByText('Delete reports'));
      const heading = screen.getByRole('heading', { name: 'Delete multiple reports' });
      expect(heading).toBeInTheDocument();
    });
  });
});
