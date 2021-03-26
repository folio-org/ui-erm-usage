import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
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

  test('should render UDP', () => {
    renderUDP(stripes);
    userEvent.click(screen.getByText('Harvesting configuration'));

    // TODO: Harvesting status is always visible. How to test the accordion?
    expect(screen.getByText('Harvesting status')).toBeVisible();
  });
});
