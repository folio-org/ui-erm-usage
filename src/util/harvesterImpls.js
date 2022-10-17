const extractHarvesterImpls = (resources) => {
  const records = resources.harvesterImpls?.records || [];
  const implementations = records.length
    ? records[0].implementations
    : [];
  const results = implementations.map(i => ({
    value: i.type,
    label: i.name
  }));
  results.unshift({ value: undefined, label: '' });
  return results;
};

export default extractHarvesterImpls;
