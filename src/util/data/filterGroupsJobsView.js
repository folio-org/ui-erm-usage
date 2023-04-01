const filterGroups = [
  {
    name: 'status',
    cql: 'status',
    values: ['scheduled', 'running', 'finished'],
  },
  {
    name: 'result',
    cql: 'result',
    values: ['failure', 'success'],
  },
  {
    name: 'type',
    cql: 'type',
    values: ['periodic', 'tenant', 'provider'],
  },
];

export default filterGroups;
