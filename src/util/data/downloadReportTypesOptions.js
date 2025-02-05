const release50Options = {
  'DR': ['DR', 'DR_D1'],
  'IR': ['IR'],
  'PR': ['PR'],
  'TR': ['TR', 'TR_J1', 'TR_J3', 'TR_J4', 'TR_B1', 'TR_B3'],
};

const release51Options = {
  'DR': ['DR', 'DR_D1', 'DR_D2'],
  'IR': ['IR', 'IR_A1', 'IR_M1'],
  'PR': ['PR', 'PR_1'],
  'TR': ['TR', 'TR_J1', 'TR_J2', 'TR_J3', 'TR_J4', 'TR_B1', 'TR_B2', 'TR_B3'],
};

const rawDownloadCounterReportTypeMapping = {
  '4': {
    'JR1': ['JR1'],
    'DB1': ['DB1'],
    'BR1': ['BR1'],
    'BR2': ['BR2'],
    'PR1': ['PR1'],
  },
  '5': release50Options,
  '5.1': release51Options,
};

export default rawDownloadCounterReportTypeMapping;
