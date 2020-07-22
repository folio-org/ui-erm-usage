import {
  Model,
  belongsTo
} from 'miragejs';

export default Model.extend({
  provider: belongsTo('usage-data-provider'),
});
