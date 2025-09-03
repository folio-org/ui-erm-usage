import { getAvailableReports, getDownloadCounterReportTypes } from './utils';

describe('getDownloadCounterReportTypes', () => {
  it('should return correct values for release 4 and report JR1', () => {
    const expectedValues = [{ value: 'JR1 (4)', label: 'JR1 (4)', release: '4' }];
    expect(getDownloadCounterReportTypes('4', 'JR1')).toEqual(expectedValues);
  });

  it('should return correct values for release 5 and report DR', () => {
    const expectedValues = [
      { value: 'DR (5)', label: 'DR (5)', release: '5' },
      { value: 'DR_D1 (5)', label: 'DR_D1 (5)', release: '5' },
    ];
    expect(getDownloadCounterReportTypes('5', 'DR')).toEqual(expectedValues);
  });

  it('should return correct values for release 5.1 and report DR', () => {
    const expectedValues = [
      { value: 'DR (5.1)', label: 'DR (5.1)', release: '5.1' },
      { value: 'DR_D1 (5.1)', label: 'DR_D1 (5.1)', release: '5.1' },
      { value: 'DR_D2 (5.1)', label: 'DR_D2 (5.1)', release: '5.1' },
    ];
    expect(getDownloadCounterReportTypes('5.1', 'DR')).toEqual(expectedValues);
  });

  it('should return empty array for undefined reports', () => {
    expect(getDownloadCounterReportTypes('1', 'DR')).toEqual([]);
  });
});

describe('getAvailableReports', () => {
  const reports = [
    {
      year: 2018,
      stats: [
        {
          report: 'JR1',
          release: '4',
          '01': {},
          '02': {},
        },
        {
          report: 'TR',
          release: '5',
          '01': {},
          '02': {},
        },
      ],
    },
    {
      year: 2019,
      stats: [
        {
          report: 'JR1',
          release: '4',
          '01': {},
          '02': {},
        },
        {
          report: 'TR',
          release: '5.1',
          '01': {},
          '02': {
            failedAttempts: 1,
          },
        },
        {
          report: 'PR',
          release: '5.1',
          '01': {
            failedAttempts: 1,
          },
          '02': {
            failedAttempts: 1,
          },
        },
      ],
    },
  ];

  it('should return an array of available reports', () => {
    const expected = [
      {
        report: 'JR1',
        release: '4',
      },
      {
        report: 'TR',
        release: '5',
      },
      {
        report: 'TR',
        release: '5.1',
      },
    ];
    const result = getAvailableReports(reports);
    expect(result).toEqual(expected);
  });
});
