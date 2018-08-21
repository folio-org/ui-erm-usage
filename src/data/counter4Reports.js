
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
    name: 'JR1a',
    code: 'jr1_a'
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
    name: 'DR1',
    code: 'dr1'
  },
  {
    name: 'DR2',
    code: 'dr2'
  },
  {
    name: 'PR1',
    code: 'pr1'
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
    name: 'TR3 Mobile',
    code: 'tr3_mobile'
  }
];

const counter4Reports = {

  selectedOptions: selected => data.map(
    r => ({
      label: r.name,
      value: r.name,
      selected: r.name === selected
    })
  ),

};

export default counter4Reports;
