import extractErrorCode from './extractErrorCode';

describe('extractErrorCode', () => {
  it('extract "code" und "message" correctly', () => {
    const input = '{"Code":3030,"Severity":"Error","Message":"No Usage Available for Requested Dates"}';

    const result = extractErrorCode(input);

    expect(result).toEqual({
      code: '3030',
      message: 'No Usage Available for Requested Dates',
    });
  });

  it('extract "number" instead of "code"', () => {
    const input = 'Something went wrong. Number=1234.';

    const result = extractErrorCode(input);

    expect(result).toEqual({
      code: '1234',
      message: null,
    });
  });

  it('return null, if code or number are not available', () => {
    const input = '{"Message":"Only a message"}';

    const result = extractErrorCode(input);

    expect(result).toBe(null);
  });
});
