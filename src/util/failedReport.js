const extractErrorCodeFromFailedReason = (failedReason) => {
  const counter4Regex = /Number=(\d{1,4})/;
  const counter5Regex = /"Code"\s*:\s*(\d{1,4})/;

  const codeMatch = failedReason.match(counter4Regex) || failedReason.match(counter5Regex);
  return codeMatch ? parseInt(codeMatch[1], 10) : null;
};

const hasApiExceptions = (report) => report?.apiExceptions?.length > 0;

const isFailedReport = (report) => hasApiExceptions(report) || !!report?.failedReason;

/**
 * Returns the distinct exception codes of a report in ascending order.
 * Reads them from `apiExceptions` and falls back to parsing `failedReason`.
 */
const extractErrorCodesFromReport = (report) => {
  if (hasApiExceptions(report)) {
    const codes = report.apiExceptions.map(({ code }) => code);
    return [...new Set(codes)].sort((a, b) => a - b);
  }

  if (report?.failedReason) {
    const code = extractErrorCodeFromFailedReason(report.failedReason);
    return code === null ? [] : [code];
  }

  return [];
};

/**
 * Returns the lowest exception code of a report, or null if it has none.
 */
const extractErrorCodeFromReport = (report) => {
  const codes = extractErrorCodesFromReport(report);
  return codes.length > 0 ? codes[0] : null;
};

export {
  extractErrorCodeFromReport,
  extractErrorCodesFromReport,
  hasApiExceptions,
  isFailedReport,
};
