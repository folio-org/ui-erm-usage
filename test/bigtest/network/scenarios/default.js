/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.create('aggregator-setting', 'withUsageDataProviders');
  server.create('usage-data-provider', 'withUsageReports');
  // server.createList('counter-report', 5);
}
