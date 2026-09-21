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

const splitHarvesterImpls = (records) => {
  // keep "not loaded" as empty records, so isServiceTypeSupported does not mark everything as unsupported
  if (!records?.length) return { aggregatorImpls: [], harvesterImpls: [] };

  const implementations = getImplementations(records);
  return {
    aggregatorImpls: [{ implementations: implementations.filter(i => i.isAggregator) }],
    harvesterImpls: [{ implementations: implementations.filter(i => !i.isAggregator) }],
  };
};

const isServiceTypeSupported = (records, serviceType) => {
  if (!serviceType || !records?.length) return true;
  return getImplementations(records).some(i => i.type === serviceType);
};

const formatUnsupportedLabel = (intl, label, isSupported) => {
  if (isSupported) return label;
  return intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.unsupportedValue' }, { value: label });
};

export {
  formatUnsupportedLabel,
  getImplementations,
  isServiceTypeSupported,
  splitHarvesterImpls,
};

export default extractHarvesterImpls;
