import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  aggregator : belongsTo('aggregator-setting'),
});
