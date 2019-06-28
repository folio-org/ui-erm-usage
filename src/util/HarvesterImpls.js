const extractHarvesterImpls = (resources) => {
  const records = (resources.harvesterImpls || {}).records || [];
  const implementations = records.length
    ? records[0].implementations
    : [];
  return implementations.map(i => ({
    value: i.type,
    label: i.name
  }));
};

export default extractHarvesterImpls;
