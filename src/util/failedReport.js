const extractErrorCodeFromFailedReason = (failedReason) => {
  const counter4Regex = /Number=(\d{1,4})/;
  const counter5Regex = /"Code"\s*:\s*(\d{1,4})/;

  const codeMatch = failedReason.match(counter4Regex) || failedReason.match(counter5Regex);
  return codeMatch ? parseInt(codeMatch[1], 10) : null;
};

/**
 * @returns {boolean} `true` if `apiExceptions` has at least one entry.
 */
const hasApiExceptions = (report) => report?.apiExceptions?.length > 0;

/**
 * @returns {boolean} `true` if the report has `apiExceptions` or a `failedReason`.
 */
const isFailedReport = (report) => hasApiExceptions(report) || !!report?.failedReason;

/**
 * @returns {number[]} The distinct codes from `apiExceptions` (or else `failedReason`)
 *   in ascending order, so the first one has the highest priority.
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

export {
  extractErrorCodesFromReport,
  hasApiExceptions,
  isFailedReport,
};
