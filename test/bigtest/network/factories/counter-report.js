import { association } from '@bigtest/mirage';
import Factory from './application';

export default Factory.extend({
  downloadTime: () => '2019-03-14T08:55:23.085+0000',
  release: () => 4,
  reportName: () => 'JR1',
  yearMonth: () => '2018-02',
  customerId: (i) => 'customerId_' + i,
  provider: association()
});
