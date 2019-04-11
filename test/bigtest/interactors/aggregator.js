import {
  interactor,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

export default @interactor class AggregatorInteractor {
  static defaultScope = '[data-test-aggregator-instances]';

  instances = collection('[class=hasEntries] nav a');

  instance = scoped('[data-test-aggregator-details]');
}
