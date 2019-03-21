/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.createList('aggregator-setting', 5);
  server.createList('usage-data-provider', 5);
  server.createList('counter-report', 5);
}
