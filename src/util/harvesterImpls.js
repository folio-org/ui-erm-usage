import legacyServiceTypeNames from './data/legacyServiceTypes';

const getImplementations = (records) => {
  return records?.length
    ? (records[0].implementations ?? [])
    : [];
};

const extractHarvesterImpls = (records) => {
  const implementations = getImplementations(records);
  const results = implementations.map(i => ({
    value: i.type,
    label: i.name,
  }));
  results.unshift({ value: undefined, label: '' });
  return results;
};

const isServiceTypeSupported = (records, serviceType) => {
  const implementations = getImplementations(records);
  return !serviceType || !implementations.length || implementations.some(i => i.type === serviceType);
};

const getLegacyServiceTypeName = (serviceType) => legacyServiceTypeNames[serviceType] ?? serviceType;

export {
  getImplementations,
  getLegacyServiceTypeName,
  isServiceTypeSupported,
};

export default extractHarvesterImpls;
