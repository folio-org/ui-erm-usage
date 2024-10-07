const rawCounterReportMapping = {
  '4': ['BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR7', 'DB1', 'DB2', 'JR1', 'JR1 GOA', 'JR1a', 'JR2', 'JR3', 'JR3 Mobile', 'JR4', 'JR5', 'MR1', 'MR1 Mobile', 'PR1', 'TR1', 'TR2', 'TR3', 'TR3 Mobile'],
  '5': ['DR', 'IR', 'PR', 'TR'],
  '5.1': ['DR', 'IR', 'PR', 'TR'],
};

function generateCounterData() {
  const dataArray = [];

  Object.keys(rawCounterReportMapping).forEach(version => {
    const names = rawCounterReportMapping[version];
    names.forEach(name => {
      dataArray.push({
        label: name,
        value: name,
        counterVersion: version,
      });
    });
  });

  return dataArray;
}

const counterReportMapping = generateCounterData();

export default counterReportMapping;
