const extractHarvesterImpls = (resources, labelName) => {
  const implementations = resources.length
    ? resources[0].implementations
    : [];
  const results = implementations.map(i => ({
    value: i.type,
    label: labelName ? i[labelName] : i.name,
  }));
  results.unshift({ value: undefined, label: '' });
  return results;
};

export default extractHarvesterImpls;
