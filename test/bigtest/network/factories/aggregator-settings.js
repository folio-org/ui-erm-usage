import { faker } from '@bigtest/mirage';
import Factory from './application';

const { lorem } = faker;

export default Factory.extend({
  label: (i) => 'label_' + i,
  serviceType: () => 'NSS',
  serviceUrl: (i) => 'www.myaggregator_' + i + '.com'
});
