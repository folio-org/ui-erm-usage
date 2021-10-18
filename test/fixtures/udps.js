const udps = [
  {
    id: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
    label: 'American Chemical Society',
    description: 'This is a mock udp',
    harvestingConfig: {
      harvestingStatus: 'active',
      harvestVia: 'aggregator',
      aggregator: {
        id: '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
        name: 'German National Statistics Server',
        vendorCode: 'ACSO',
      },
      reportRelease: 5,
      requestedReports: ['IR', 'TR'],
      harvestingStart: '2019-01',
    },
    sushiCredentials: {
      customerId: '0000000000',
      requestorId: '00000',
      apiKey: 'api123',
      requestorName: 'Opentown Libraries',
      requestorMail: 'electronic@lib.optentown.edu',
    },
    latestReport: '2018-04',
    earliestReport: '2018-01',
    hasFailedReport: 'no',
    reportErrorCodes: [],
    reportTypes: ['JR1'],
    notes:
      'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
  },
  {
    id: 'd67924ee-aa00-454e-8fd0-c3f81339d20d',
    label: 'Test udp',
    description: 'This is a second mock udp',
    harvestingConfig: {
      harvestingStatus: 'active',
    },
  }
];

export default udps;
