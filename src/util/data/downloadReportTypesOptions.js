const rawDownloadCounterReportTypeMapping = {
  '4': {
    'JR1': [
      'JR1'
    ],
    'DB1': [
      'DB1'
    ],
    'BR1': [
      'BR1'
    ],
    'BR2': [
      'BR2'
    ],
    'PR1': [
      'PR1'
    ],
  },
  '5': {
    'DR': [
      'DR',
      'DR_D1',
    ],
    'IR': [
      'IR'
    ],
    'PR': [
      'PR'
    ],
    'TR': [
      'TR',
      'TR_J1',
      'TR_J3',
      'TR_J4',
      'TR_B1',
      'TR_B3',
    ],
  },
  '5.1': {
    'DR': [
      'DR',
      'DR_D1',
    ],
    'IR': [
      'IR'
    ],
    'PR': [
      'PR'
    ],
    'TR': [
      'TR',
      'TR_J1',
      'TR_J3',
      'TR_J4',
      'TR_B1',
      'TR_B3',
    ],
  }
};

const generateReportTypeData = () => {
  const result = [];

  // Iterate through each release version in the mapping
  for (const [release, reports] of Object.entries(rawDownloadCounterReportTypeMapping)) {
    // For each report type in the release version
    for (const reportTypes of Object.values(reports)) {
      reportTypes.forEach((type) => {
        // Add the formatted entry to the result array
        result.push({
          value: type,
          label: `${type} (${release})`
        });
      });
    }
  }

  return result;
};

const downloadCounterReportTypeMapping = generateReportTypeData();

export default downloadCounterReportTypeMapping;
