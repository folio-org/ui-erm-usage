import { trait } from '@bigtest/mirage';
import Factory from './application';

export default Factory.extend({
  label: (i) => 'UDP ' + i,
  vendor: (i) => ({
    id: 'vid_' + i,
    name: 'vendor_' + i
  }),
  platform: (i) => ({
    id: 'pid_' + i,
    name: 'platform_' + i
  }),
  harvestingConfig: (i) => ({
    harvestingStatus: 'active',
    harvestVia: 'sushi',
    reportRelease: 4,
    requestedReports: ['JR1', 'JR2'],
    harvestingStart: '2018-01',
    sushiConfig: {
      serviceType: 'cs41',
      serviceUrl: 'www.sushiUrl-' + i + '.de'
    }
  }),
  sushiCredentials: (i) => ({
    customerId: 'customer_' + i,
    requestorId: 'requestor_' + i
  }),
  afterCreate(udp, server) {
    if (udp.aggregator) {
      udp.update({
        harvestingConfig: {
          harvestingStatus: 'active',
          harvestVia: 'aggregator',
          reportRelease: 4,
          requestedReports: ['JR1', 'JR2'],
          harvestingStart: '2018-01',
          aggregator: {
            id: udp.aggregator.id,
            name : udp.aggregator.label,
            vendorCode : 'Nature'
          }
        }
      });
    }
  },

  withUsageReports: trait({
    afterCreate(provider, server) {
      server.createList('counter-report', 5, { provider });
    }
  })
});