
export const data = [
  {
    name: 'JR1',
    code: 'jr1'
  },
  {
    name: 'JR1 GOA',
    code: 'jr1_goa'
  },
  {
    name: 'JR2',
    code: 'jr2'
  },
  {
    name: 'JR3',
    code: 'jr3'
  },

  {
    name: 'JR3 Mobile',
    code: 'jr3_mobile'
  },
  {
    name: 'JR4',
    code: 'jr4'
  },
  {
    name: 'JR5',
    code: 'jr5'
  },
  {
    name: 'DB1',
    code: 'db1'
  },
  {
    name: 'DB2',
    code: 'db2'
  },
  {
    name: 'BR1',
    code: 'br1'
  },
  {
    name: 'BR2',
    code: 'br2'
  },
  {
    name: 'BR3',
    code: 'br3'
  },
  {
    name: 'BR4',
    code: 'br4'
  },
  {
    name: 'BR5',
    code: 'br5'
  },
  {
    name: 'BR6',
    code: 'br6'
  },
  {
    name: 'BR7',
    code: 'br7'
  },
  {
    name: 'MR1',
    code: 'mr1'
  },
  {
    name: 'MR1 Mobile',
    code: 'mr1_mobile'
  },
  {
    name: 'TR1',
    code: 'tr1'
  },
  {
    name: 'TR2',
    code: 'tr2'
  },
  {
    name: 'TR3',
    code: 'tr3'
  },
  {
    name: 'TR4',
    code: 'tr4'
  }
];

const reports = {

  selectedOptions: selected => data.map(
    r => ({
      label: r.name,
      value: r.name,
      selected: r.name === selected
    })
  ),

};

export default reports;
