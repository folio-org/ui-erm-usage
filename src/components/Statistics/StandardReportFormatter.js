import React from 'react';

import ReportInfoButton from './Counter/ReportInfoButton';

const createReportFormatter = (
  handlers,
  maxFailed,
  stripes,
  udpLabel
) => {
  return ({
    'report': (report) => report.report,
    '01': (report) => (
      <ReportInfoButton
        report={report['01']}
        stripes={stripes}
        maxFailedAttempts={maxFailed}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '02': (report) => (
      <ReportInfoButton
        report={report['02']}
        stripes={stripes}
        maxFailedAttempts={maxFailed}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '03': (report) => (
      <ReportInfoButton
        report={report['03']}
        stripes={stripes}
        maxFailedAttempts={maxFailed}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '04': (report) => (
      <ReportInfoButton
        report={report['04']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '05': (report) => (
      <ReportInfoButton
        report={report['05']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '06': (report) => (
      <ReportInfoButton
        report={report['06']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '07': (report) => (
      <ReportInfoButton
        report={report['07']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '08': (report) => (
      <ReportInfoButton
        report={report['08']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '09': (report) => (
      <ReportInfoButton
        report={report['09']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '10': (report) => (
      <ReportInfoButton
        report={report['10']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '11': (report) => (
      <ReportInfoButton
        report={report['11']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
    '12': (report) => (
      <ReportInfoButton
        report={report['12']}
        stripes={stripes}
        maxFailedAttempts={5}
        udpLabel={udpLabel}
        handlers={handlers}
      />
    ),
  });
};

export default createReportFormatter;
