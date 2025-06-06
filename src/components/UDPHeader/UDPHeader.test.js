import { StripesContext, useStripes } from '@folio/stripes/core';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
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
    expect(screen.getByText('Provider status')).toBeInTheDocument();
    expect(screen.getByText('Latest statistics')).toBeInTheDocument();
    expect(screen.getByText('Harvesting status')).toBeInTheDocument();
    expect(screen.getByText('Last harvesting job finished at')).toBeInTheDocument();
    expect(screen.queryAllByText('-')).toHaveLength(4);
  });

  it('should display labels and values', () => {
    renderUDPHeader(
      stripes,
      {
        latestReport: '2022-11',
        harvestingConfig: { harvestingStatus: 'active' },
        status: 'active',
      },
      { finishedAt: '2022-12-09T21:52:05.933+00:00' }
    );
    expect(screen.getByText('Latest statistics')).toBeInTheDocument();
    expect(screen.getByText('Harvesting status')).toBeInTheDocument();
    expect(screen.getByText('Last harvesting job finished at')).toBeInTheDocument();
    expect(screen.getByText('2022-11')).toBeInTheDocument();
    expect(screen.queryAllByText('Active')).toHaveLength(2);
    expect(screen.getByText('12/9/2022, 9:52:05 PM')).toBeInTheDocument();
  });
});
