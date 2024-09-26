
export const data = [
  {
    name: 'JR1',
    code: 'jr1',
    counterVersion: '4'
  },
  {
    name: 'JR1 GOA',
    code: 'jr1_goa',
    counterVersion: '4'
  },
  {
    name: 'JR1a',
    code: 'jr1_a',
    counterVersion: '4'
  },
  {
    name: 'JR2',
    code: 'jr2',
    counterVersion: '4'
  },
  {
    name: 'JR3',
    code: 'jr3',
    counterVersion: '4'
  },

  {
    name: 'JR3 Mobile',
    code: 'jr3_mobile',
    counterVersion: '4'
  },
  {
    name: 'JR4',
    code: 'jr4',
    counterVersion: '4'
  },
  {
    name: 'JR5',
    code: 'jr5',
    counterVersion: '4'
  },
  {
    name: 'DB1',
    code: 'db1',
    counterVersion: '4'
  },
  {
    name: 'DB2',
    code: 'db2',
    counterVersion: '4'
  },
  {
    name: 'PR1',
    code: 'pr1',
    counterVersion: '4'
  },
  {
    name: 'BR1',
    code: 'br1',
    counterVersion: '4'
  },
  {
    name: 'BR2',
    code: 'br2',
    counterVersion: '4'
  },
  {
    name: 'BR3',
    code: 'br3',
    counterVersion: '4'
  },
  {
    name: 'BR4',
    code: 'br4',
    counterVersion: '4'
  },
  {
    name: 'BR5',
    code: 'br5',
    counterVersion: '4'
  },
  {
    name: 'BR7',
    code: 'br7',
    counterVersion: '4'
  },
  {
    name: 'MR1',
    code: 'mr1',
    counterVersion: '4'
  },
  {
    name: 'MR1 Mobile',
    code: 'mr1_mobile',
    counterVersion: '4'
  },
  {
    name: 'TR1',
    code: 'tr1',
    counterVersion: '4'
  },
  {
    name: 'TR2',
    code: 'tr2',
    counterVersion: '4'
  },
  {
    name: 'TR3',
    code: 'tr3',
    counterVersion: '4'
  },
  {
    name: 'TR3 Mobile',
    code: 'tr3_mobile',
    counterVersion: '4'
  },
  {
    name: 'DR',
    code: 'dr',
    counterVersion: '5'
  },
  {
    name: 'IR',
    code: 'ir',
    counterVersion: '5'
  },
  {
    name: 'PR',
    code: 'pr',
    counterVersion: '5'
  },
  {
    name: 'TR',
    code: 'tr',
    counterVersion: '5'
  },
  {
    name: 'DR',
    code: 'dr',
    counterVersion: '5.1'
  },
  {
    name: 'IR',
    code: 'ir',
    counterVersion: '5.1'
  },
  {
    name: 'PR',
    code: 'pr',
    counterVersion: '5.1'
  },
  {
    name: 'TR',
    code: 'tr',
    counterVersion: '5.1'
  }
];

const rawCounterReportMapping = {
  '4': ['jr1', 'jr1_goa', 'jr1_a', 'jr2', 'jr3', 'jr3_mobile', 'jr4', 'jr5', 'db1', 'db2', 'pr1', 'br1', 'br2', 'br3', 'br4', 'br5', 'br7', 'mr1', 'mr1_mobile', 'tr1', 'tr2', 'tr3', 'tr3_mobile'],
  '5': ['dr', 'ir', 'pr', 'tr'],
  '5.1': ['dr', 'ir', 'pr', 'tr'],
};

function generateCounterData() {
  const dataArray = [];

  Object.keys(rawCounterReportMapping).forEach(version => {
    const codes = rawCounterReportMapping[version];
    codes.forEach(code => {
      dataArray.push({
        name: code.toUpperCase().replace(/_/g, ' '),
        code,
        counterVersion: version
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
