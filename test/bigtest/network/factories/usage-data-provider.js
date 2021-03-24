import { trait } from 'miragejs';
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
  afterCreate(udp, _) {
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
      server.createList('custom-report', 2, { provider });
    }
  }),

  withCustomReportsLinks: trait({
    afterCreate(provider, server) {
      server.createList('custom-report', 2, { provider, fileId: null, fileName: null, fileSize: null, linkUrl: 'https://www.abc.com' });
    }
  }),

  withNonManuallyEditedCounterReports: trait({
    afterCreate(provider, server) {
      server.createList('counter-report', 9, { provider, reportEditedManually: false, editReason: null });
    }
  }),

  withManuallyEditedCounterReports: trait({
    afterCreate(provider, server) {
      server.createList('counter-report', 9, { provider, reportEditedManually: true, editReason: 'reason for edit manually' });
    }
  }),

  withCounterReportWithSushiErrorCode: trait({
    afterCreate(provider, server) {
      server.createList('counter-report', 9, { provider, failedReason: 'Report not valid: Exception{Number=3030, Severity=ERROR, Message=No Data Found}' });
    }
  }),

  withCounterReportWithNonSushiErrorCode: trait({
    afterCreate(provider, server) {
      server.createList('counter-report', 9, { provider, failedReason: '{"status":"error","message":"Invalid REST request: HTTP 404 Not Found"}' });
    }
  }),

  withSetInactive: trait({
    afterCreate(provider, _) {
      provider.harvestingConfig.harvestingStatus = 'inactive';
    }
  })
});
