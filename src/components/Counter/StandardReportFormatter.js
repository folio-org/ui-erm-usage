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

const createReportFormatter = (handlers, maxFailed, stripes, udpLabel) => {
  return {
    'report': (report) => report.report,
    '01': (report) => createReportInfoButton('01', report, handlers, maxFailed, stripes, udpLabel),
    '02': (report) => createReportInfoButton('02', report, handlers, maxFailed, stripes, udpLabel),
    '03': (report) => createReportInfoButton('03', report, handlers, maxFailed, stripes, udpLabel),
    '04': (report) => createReportInfoButton('04', report, handlers, maxFailed, stripes, udpLabel),
    '05': (report) => createReportInfoButton('05', report, handlers, maxFailed, stripes, udpLabel),
    '06': (report) => createReportInfoButton('06', report, handlers, maxFailed, stripes, udpLabel),
    '07': (report) => createReportInfoButton('07', report, handlers, maxFailed, stripes, udpLabel),
    '08': (report) => createReportInfoButton('08', report, handlers, maxFailed, stripes, udpLabel),
    '09': (report) => createReportInfoButton('09', report, handlers, maxFailed, stripes, udpLabel),
    '10': (report) => createReportInfoButton('10', report, handlers, maxFailed, stripes, udpLabel),
    '11': (report) => createReportInfoButton('11', report, handlers, maxFailed, stripes, udpLabel),
    '12': (report) => createReportInfoButton('12', report, handlers, maxFailed, stripes, udpLabel)
  };
};

export default createReportFormatter;
