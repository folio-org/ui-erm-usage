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

export const getAvailableReports = reports => {
  return reports
    .flatMap(c => c.stats)
    .filter(cr => {
      return Object.values(cr).some(monthData => {
        return (
          typeof monthData === 'object' &&
          (!monthData.failedAttempts || monthData.failedAttempts === 0)
        );
      });
    })
    .map(cr => ({ report: cr.report, release: cr.release }));
};
