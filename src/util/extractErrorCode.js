const extractErrorCodeFromFailedReason = (input) => {
  const counter4Regex = /Number=(\d{1,4})/;
  const counter5Regex = /"Code"\s*:\s*(\d{1,4})/;

  const codeMatch = input.match(counter4Regex) || input.match(counter5Regex);
  return codeMatch ? codeMatch[1] : null;
};

const extractErrorCodeFromApiExceptions = (apiExceptions) => apiExceptions.reduce(
  (smallest, exception) => (exception.code < smallest ? exception.code : smallest),
  apiExceptions[0].code
);

const extractErrorCodeFromReport = (report) => {
  if (!report.apiExceptions && !report.failedReason) {
    return null;
  }

  if (report.apiExceptions && report.apiExceptions.length > 0) {
    return extractErrorCodeFromApiExceptions(report.apiExceptions);
  }

  if (report.failedReason) {
    return extractErrorCodeFromFailedReason(report.failedReason);
  }

  return null;
};

const extractErrorFromReport = (report) => {
  if (!report.apiExceptions && !report.failedReason) {
    return null;
  }

  if (report.apiExceptions && report.apiExceptions.length > 0) {
    return report.apiExceptions.join(', ');
  }

  if (report.failedReason) {
    return report.failedReason;
  }

  return null;
};

export {
  extractErrorCodeFromReport,
  extractErrorFromReport,
};
