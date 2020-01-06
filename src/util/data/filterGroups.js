const filterGroups = [
  {
    label: 'Harvesting status',
    name: 'harvestingStatus',
    cql: 'harvestingConfig.harvestingStatus',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Inactive', cql: 'inactive' }
    ]
  },
  {
    label: 'Harvest via',
    name: 'harvestVia',
    cql: 'harvestingConfig.harvestVia',
    values: [
      { name: 'Sushi', cql: 'sushi' },
      { name: 'Aggregator', cql: 'aggregator' }
    ]
  },
  {
    label: 'Aggregators',
    name: 'aggregators',
    cql: 'harvestingConfig.aggregator.name',
    values: [],
    restrictWhenAllSelected: true
  },
  {
    label: 'Has failed reports',
    name: 'hasFailedReport',
    cql: 'hasFailedReport',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ]
  },
  {
    label: 'Tags',
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
  }
];

export default filterGroups;
