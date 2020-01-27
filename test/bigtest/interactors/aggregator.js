import {
  interactor,
  scoped,
  collection
} from '@bigtest/interactor';

export default @interactor class AggregatorInteractor {
  static defaultScope = '[data-test-aggregator-instances]';

  // instances = collection('[class=hasEntries] nav a');
  instances = collection('[data-test-nav-list-item] a');

  instance = scoped('[data-test-aggregator-details]');
}
