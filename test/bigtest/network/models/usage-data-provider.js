import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  aggregator : belongsTo('aggregator-setting'),
});
