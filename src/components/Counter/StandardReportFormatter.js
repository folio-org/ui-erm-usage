import ReportInfoButton from './ReportInfoButton';

const createReportInfoButton = (id, report, handlers, maxFailed, stripes, udpLabel) => (
  <ReportInfoButton
    report={report[id]}
    stripes={stripes}
    maxFailedAttempts={maxFailed}
    udpLabel={udpLabel}
    handlers={handlers}
  />
);

const generateMonthFormatters = (handlers, maxFailed, stripes, udpLabel) => {
  const monthFormatter = {};
  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, '0');
    monthFormatter[month] = (report) => createReportInfoButton(month, report, handlers, maxFailed, stripes, udpLabel);
  }
  return monthFormatter;
};

const createReportFormatter = (handlers, maxFailed, stripes, udpLabel) => {
  return {
    'report': (report) => report.report,
    'release': (report) => report.release,
    ...generateMonthFormatters(handlers, maxFailed, stripes, udpLabel),
  };
};

export default createReportFormatter;
