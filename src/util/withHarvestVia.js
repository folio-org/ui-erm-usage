import { HARVEST_VIA_SUSHI } from './constants';

// The harvester still requires harvestVia
// since only SUSHI is supported now, always set it to 'sushi'
const withHarvestVia = udp => ({
  ...udp,
  harvestingConfig: { ...udp.harvestingConfig, harvestVia: HARVEST_VIA_SUSHI },
});

export default withHarvestVia;
