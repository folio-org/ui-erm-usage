import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.aggregatorSettings)) {
      return assign({}, json, {
        totalRecords: json.aggregatorSettings.length
      });
    } else {
      return json.aggregatorSettings;
    }
  }

});
