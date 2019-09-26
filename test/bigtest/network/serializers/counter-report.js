import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serializeIds: 'always',

  keyForForeignKey(relationshipName) {
    return relationshipName + 'Id';
  },

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.counterReports)) {
      return assign({}, json, {
        totalRecords: json.counterReports.length
      });
    } else {
      return json.counterReports;
    }
  }

});
