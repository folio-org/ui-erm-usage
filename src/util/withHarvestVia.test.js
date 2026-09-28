import withHarvestVia from './withHarvestVia';

describe('withHarvestVia', () => {
  it('adds harvestVia sushi to a UDP without harvestVia', () => {
    const udp = { label: 'UDP', harvestingConfig: { harvestingStatus: 'active' } };

    expect(withHarvestVia(udp)).toEqual({
      label: 'UDP',
      harvestingConfig: { harvestingStatus: 'active', harvestVia: 'sushi' },
    });
  });

  it('replaces another harvestVia with sushi', () => {
    const udp = { harvestingConfig: { harvestVia: 'aggregator' } };

    expect(withHarvestVia(udp).harvestingConfig.harvestVia).toBe('sushi');
  });

  it('adds harvestingConfig if missing', () => {
    expect(withHarvestVia({ label: 'UDP' })).toEqual({ label: 'UDP', harvestingConfig: { harvestVia: 'sushi' } });
  });
});
