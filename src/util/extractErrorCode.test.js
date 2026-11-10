import {
  extractErrorCodeFromReport,
  extractErrorFromReport,
} from './extractErrorCode';

describe('extractErrorCodeFromReport', () => {
  it('extracts "code" from failedReason', () => {
    const report = {
      failedReason: '{"Code":3030,"Severity":"Error","Message":"No Usage Available for Requested Dates"}',
    };

    expect(extractErrorCodeFromReport(report)).toBe('3030');
  });

  it('extracts "number" instead of "code" from failedReason', () => {
    const report = { failedReason: 'Something went wrong. Number=1234.' };

    expect(extractErrorCodeFromReport(report)).toBe('1234');
  });

  it('returns null when no code or number is available', () => {
    const report = { failedReason: '{"Message":"Only a message"}' };

    expect(extractErrorCodeFromReport(report)).toBe(null);
  });

  it('returns the smallest code from api exceptions', () => {
    const report = {
      apiExceptions: [
        { code: 3030 },
        { code: 1000 },
        { code: 2000 },
      ],
    };

    expect(extractErrorCodeFromReport(report)).toBe(1000);
  });

  it('returns null when the report has no errors', () => {
    expect(extractErrorCodeFromReport({})).toBe(null);
  });
});

describe('extractErrorFromReport', () => {
  it('returns failedReason when there are no api exceptions', () => {
    const report = { failedReason: 'Something went wrong.' };

    expect(extractErrorFromReport(report)).toBe('Something went wrong.');
  });

  it('joins api exceptions', () => {
    const report = { apiExceptions: ['first error', 'second error'] };

    expect(extractErrorFromReport(report)).toBe('first error, second error');
  });

  it('returns null when the report has no errors', () => {
    expect(extractErrorFromReport({})).toBe(null);
  });
});
