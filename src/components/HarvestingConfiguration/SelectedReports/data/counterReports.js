const rawCounterReportMapping = {
  '4': ['JR1', 'JR1 GOA', 'JR1a', 'JR2', 'JR3', 'JR3 Mobile', 'JR4', 'JR5', 'DB1', 'DB2', 'PR1', 'BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR7', 'MR1', 'MR1 Mobile', 'TR1', 'TR2', 'TR3', 'TR3 Mobile'],
  '5': ['DR', 'IR', 'PR', 'TR'],
  '5.1': ['DR', 'IR', 'PR', 'TR'],
};

function generateCounterData() {
  const dataArray = [];

  Object.keys(rawCounterReportMapping).forEach(version => {
    const names = rawCounterReportMapping[version];
    names.forEach(name => {
      dataArray.push({
        name,
        code: name.toLowerCase().replace(/ /g, '_'),
        counterVersion: version,
      });
    });
  });

  return dataArray;
}

const counterReportMapping = generateCounterData();

const sortReports = (a, b) => {
  if (a.label > b.label) {
    return 1;
  }
  if (a.label < b.label) {
    return -1;
  }
  return 0;
};

const counterReports = {
  getOptions: () => counterReportMapping.map(
    r => ({
      label: r.name,
      value: r.name,
      counterVersion: r.counterVersion,
    })
  ).sort(sortReports),
};

export default counterReports;
