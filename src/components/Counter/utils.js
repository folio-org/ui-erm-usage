import { rawDownloadCounterReportTypeMapping } from '../../util/data/downloadReportTypesOptions';

export const getDownloadCounterReportTypes = (release, report) => {
  const reportTypes = rawDownloadCounterReportTypeMapping[release]?.[report] || [];

  const reportTypeObject = reportTypes.map((reportType) => ({
    value: reportType,
    label: `${reportType} (${release})`,
    release,
  }));

  return reportTypeObject;
};

export const getAvailableReports = (reports) => {
  const availableReports = reports
    .flatMap((c) => c.stats)
    .filter((cr) => {
      return Object.values(cr).every((monthData) => {
        // skip 'report' and 'release'
        if (monthData && typeof monthData === 'string') {
          return true;
        }
        return monthData && (!monthData.failedAttempts || monthData.failedAttempts === 0);
      });
    });
  return availableReports;
};
