import { trait } from '@bigtest/mirage';
import Factory from './application';

export default Factory.extend({
  label: (i) => 'UDP ' + i,
  descriprion: (i) => 'Description ' + i,
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
  harvestingDate: () => '2020-01-22T13:26:40.687+0000',
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
      server.createList('counter-report', 9, { provider });
    }
  }),

  withSetInactive: trait({
    afterCreate(provider, server) {
      provider.harvestingConfig.harvestingStatus = 'inactive';
    }
  })
});
