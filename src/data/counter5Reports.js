
export const data = [
  {
    name: 'PR',
    code: 'pr'
  },
  {
    name: 'DR',
    code: 'dr'
  },
  {
    name: 'TR',
    code: 'tr'
  },
  {
    name: 'IR',
    code: 'ir'
  }
];

const counter5Reports = {

  selectedOptions: selected => data.map(
    r => ({
      label: r.name,
      value: r.name,
      selected: r.name === selected
    })
  ),

};

export default counter5Reports;
