
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
  }
];

const counterReports = {

  selectedOptions: selected => data.map(
    r => ({
      label: r.name,
      value: r.name,
      selected: r.name === selected
    })
  ),

  getOptions: () => data.map(
    r => ({
      label: r.name,
      value: r.name,
      counterVersion: r.counterVersion,
    })
  ),

};

export default counterReports;
