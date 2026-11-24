const showErrorInfo = (error, { callout, formatMessage }) => {
  const errorMessage =
    error?.message ||
    formatMessage({ id: 'ui-erm-usage.general.error' });

  const prefix = formatMessage({ id: 'ui-erm-usage.general.error2' });

  callout?.sendCallout?.({
    type: 'error',
    message: `${prefix}: ${errorMessage}`,
    timeout: 0,
  });

  return errorMessage;
};

export default showErrorInfo;
