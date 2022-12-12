import React from 'react';
import { useStripes } from '@folio/stripes/core';
import { screen } from '@testing-library/react';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import UDPHeader from './UDPHeader';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

const renderUDPHeader = (stripes, udp, lastJob) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <UDPHeader usageDataProvider={udp} lastJob={lastJob} />
  </StripesContext.Provider>
);

describe('UDPHeader', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  it('should display labels and no values', () => {
    renderUDPHeader(stripes);
    expect(screen.queryByText('Latest statistics')).toBeInTheDocument();
    expect(screen.queryByText('Harvesting status')).toBeInTheDocument();
    expect(screen.queryByText('Last harvesting job finished at')).toBeInTheDocument();
    expect(screen.queryAllByText('-')).toHaveLength(3);
  });

  it('should display labels and values', () => {
    renderUDPHeader(
      stripes,
      {
        latestReport: '2022-11',
        harvestingConfig: { harvestingStatus: 'active' },
      },
      { finishedAt: '2022-12-09T21:52:05.933+00:00' }
    );
    expect(screen.queryByText('Latest statistics')).toBeInTheDocument();
    expect(screen.queryByText('Harvesting status')).toBeInTheDocument();
    expect(screen.queryByText('Last harvesting job finished at')).toBeInTheDocument();
    expect(screen.queryByText('2022-11')).toBeInTheDocument();
    expect(screen.queryByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('12/9/2022, 9:52:05 PM')).toBeInTheDocument();
  });
});
