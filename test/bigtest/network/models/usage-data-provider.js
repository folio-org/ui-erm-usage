import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  aggregator : belongsTo('aggregator-setting'),
});
