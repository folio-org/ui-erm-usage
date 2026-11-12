import {
  extractErrorCodeFromReport,
  extractErrorCodesFromReport,
  hasApiExceptions,
  isFailedReport,
} from './failedReport';

const apiException = (code) => ({
  code,
  message: `Message for ${code}`,
  data: `Data for ${code}`,
});

describe('extractErrorCodesFromReport', () => {
  it('extracts "Code" from failedReason', () => {
    const report = {
      failedReason: '{"Code":3030,"Severity":"Error","Message":"No Usage Available for Requested Dates"}',
    };

    expect(extractErrorCodesFromReport(report)).toEqual([3030]);
  });

  it('extracts "Number" from failedReason', () => {
    const report = { failedReason: 'Something went wrong. Number=1234.' };

    expect(extractErrorCodesFromReport(report)).toEqual([1234]);
  });

  it('returns an empty array when failedReason has no code or number', () => {
    const report = { failedReason: '{"Message":"Only a message"}' };

    expect(extractErrorCodesFromReport(report)).toEqual([]);
  });

  it('returns all codes from apiExceptions sorted and without duplicates', () => {
    const report = {
      apiExceptions: [apiException(3031), apiException(1010), apiException(3031), apiException(2000)],
    };

    expect(extractErrorCodesFromReport(report)).toEqual([1010, 2000, 3031]);
  });

  it('prefers apiExceptions over failedReason', () => {
    const report = {
      failedReason: 'Exception{Number=3030, Severity=ERROR}',
      apiExceptions: [apiException(3031)],
    };

    expect(extractErrorCodesFromReport(report)).toEqual([3031]);
  });

  it('falls back to failedReason when apiExceptions is empty', () => {
    const report = {
      failedReason: 'Exception{Number=3030, Severity=ERROR}',
      apiExceptions: [],
    };

    expect(extractErrorCodesFromReport(report)).toEqual([3030]);
  });

  it('returns an empty array when the report has no errors', () => {
    expect(extractErrorCodesFromReport({})).toEqual([]);
  });
});

describe('extractErrorCodeFromReport', () => {
  it('returns the lowest code from apiExceptions', () => {
    const report = {
      apiExceptions: [apiException(3032), apiException(3030), apiException(3031)],
    };

    expect(extractErrorCodeFromReport(report)).toBe(3030);
  });

  it('returns the code from failedReason as a number', () => {
    const report = { failedReason: 'Exception{Number=3031, Severity=ERROR}' };

    expect(extractErrorCodeFromReport(report)).toBe(3031);
  });

  it('returns null when the report has no codes', () => {
    expect(extractErrorCodeFromReport({})).toBe(null);
    expect(extractErrorCodeFromReport({ failedReason: 'failure message' })).toBe(null);
  });
});

describe('hasApiExceptions', () => {
  it('is true only for a non-empty apiExceptions array', () => {
    expect(hasApiExceptions({ apiExceptions: [apiException(3030)] })).toBe(true);
    expect(hasApiExceptions({ apiExceptions: [] })).toBe(false);
    expect(hasApiExceptions({})).toBe(false);
  });
});

describe('isFailedReport', () => {
  it('is true for a report with apiExceptions', () => {
    expect(isFailedReport({ apiExceptions: [apiException(3030)] })).toBe(true);
  });

  it('is true for a report with only failedReason', () => {
    expect(isFailedReport({ failedReason: 'HTTP response 503', apiExceptions: [] })).toBe(true);
  });

  it('is false for a successful report', () => {
    expect(isFailedReport({ apiExceptions: [] })).toBe(false);
    expect(isFailedReport({})).toBe(false);
  });
});
