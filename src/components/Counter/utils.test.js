import { getDownloadCounterReportTypes } from './utils';

describe('getDownloadCounterReportTypes', () => {
  it('should return correct values for release 4 and report JR1', () => {
    const expectedValues = [{ value: 'JR1', label: 'JR1 (4)', release: '4' }];
    expect(getDownloadCounterReportTypes('4', 'JR1')).toEqual(expectedValues);
  });

  it('should return correct values for release 5 and report DR', () => {
    const expectedValues = [
      { value: 'DR', label: 'DR (5)', release: '5' },
      { value: 'DR_D1', label: 'DR_D1 (5)', release: '5' },
    ];
    expect(getDownloadCounterReportTypes('5', 'DR')).toEqual(expectedValues);
  });

  it('should return correct values for release 5.1 and report DR', () => {
    const expectedValues = [
      { value: 'DR', label: 'DR (5.1)', release: '5.1' },
      { value: 'DR_D1', label: 'DR_D1 (5.1)', release: '5.1' },
    ];
    expect(getDownloadCounterReportTypes('5.1', 'DR')).toEqual(expectedValues);
  });

  it('should return empty array for undefined reports', () => {
    expect(getDownloadCounterReportTypes('1', 'DR')).toEqual([]);
  });
});
