import { trait } from '@bigtest/mirage';
import Factory from './application';

export default Factory.extend({
  label: (i) => 'Aggregator ' + i,
  serviceType: () => 'NSS',
  serviceUrl: (i) => 'www.aggregator-' + i + '.com',
  aggregatorConfig : () => ({
    reportRelease : '4',
    apiKey : 'apiKey',
    requestorId : 'requestorId',
    customerId : 'customerId'
  }),
  accountConfig: (i) => ({
    configType: 'Manual',
    configMail: 'configMail' + i + '@mail.de'
  }),

  withUsageDataProviders: trait({
    afterCreate(aggregator, server) {
      server.create('usage-data-provider', { aggregator });
    }
  })
});
