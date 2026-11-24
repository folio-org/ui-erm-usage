import showErrorInfo from './showErrorInfo';

describe('showErrorInfo', () => {
  const callout = {
    sendCallout: jest.fn(),
  };

  const formatMessage = jest.fn(({ id }) => {
    const messages = {
      'ui-erm-usage.general.error': 'An unexpected error occurred',
      'ui-erm-usage.general.error2': 'Error',
    };

    return messages[id];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the error message in a callout', () => {
    const error = new Error('Request failed');

    const result = showErrorInfo(error, { callout, formatMessage });

    expect(result).toBe('Request failed');
    expect(callout.sendCallout).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error: Request failed',
      timeout: 0,
    });
  });

  it('shows a fallback message when the error has no message', () => {
    const result = showErrorInfo({}, { callout, formatMessage });

    expect(result).toBe('An unexpected error occurred');
    expect(callout.sendCallout).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error: An unexpected error occurred',
      timeout: 0,
    });
  });
});
