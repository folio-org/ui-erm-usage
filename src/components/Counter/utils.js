import { isEqual, uniqWith } from 'lodash';

import rawDownloadCounterReportTypeMapping from '../../util/data/downloadReportTypesOptions';

export const getDownloadCounterReportTypes = (release, report) => {
  const reportTypes = rawDownloadCounterReportTypeMapping[release]?.[report] || [];

  const reportTypeObject = reportTypes.map((reportType) => ({
    value: `${reportType} (${release})`,
    label: `${reportType} (${release})`,
    release,
    reportType,
  }));

  return reportTypeObject;
};

export const getAvailableReports = reports => {
  const availableReports = reports
    .flatMap(c => c.stats)
    .filter(cr => {
      return Object.values(cr).some(monthData => {
        if (monthData && typeof monthData === 'string') {
          return false;
        }
        return monthData && (!monthData.failedAttempts || monthData.failedAttempts === 0);
      });
    })
    .map(cr => ({ report: cr.report, release: cr.release }));

  return uniqWith(availableReports, isEqual);
};
