import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNil } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  Icon,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import CounterStatistics from '../../Counter';
import ReportInfoButton from '../../Counter/ReportInfoButton';
import css from '../../Counter/CounterStatistics.css';

function DeleteStatistics({
  stripes,
  providerId,
  udpLabel,
  isStatsLoading,
  handlers,
  reportsToDelete,
  addToReportsToDelete,
  removeFromReportsToDelete,
  counterReports,
  maxFailedAttempts
}) {
  const handleClickReportCheckbox = (id) => {
    if (reportsToDelete.has(id)) {
      removeFromReportsToDelete(id);
    } else {
      addToReportsToDelete(id);
    }
  };

  const renderReportNew = (report, month) => {
    const r = report[month];
    if (report?.checkbox) {
      if (isNil(r)) {
        return <></>;
      }
      return (
        <Checkbox
          checked={r ? reportsToDelete.has(r.id) : false}
          value={r.id}
          onChange={() => handleClickReportCheckbox(r.id)}
          data-testid={`checkbox-${r.id}`}
        />
      );
    } else {
      return (
        <ReportInfoButton
          report={r}
          stripes={stripes}
          maxFailedAttempts={maxFailedAttempts}
          udpLabel={udpLabel}
          handlers={handlers}
        />
      );
    }
  };

  const renderReportName = (report) => {
    if (report?.checkbox) {
      const reportIds = [];
      Object.values(report).forEach(o => {
        if (!isNil(o) && !isNil(o.id)) {
          reportIds.push(o.id);
        }
      });
      const isChecked = reportIds.every(el => reportsToDelete.has(el));
      const handleClickReportName = () => {
        if (isChecked) {
          // remove reports from reportsToDelete
          reportIds.forEach(id => {
            removeFromReportsToDelete(id);
          });
        } else {
          // add reports to reportsToDelete
          reportIds.forEach(id => {
            addToReportsToDelete(id);
          });
        }
      };
      return (
        <Checkbox
          checked={isChecked}
          label={report.report}
          value={report.report}
          onChange={() => handleClickReportName()}
        />
      );
    }
    return report.report;
  };

  const reportFormatter = {
    'report': (report) => renderReportName(report),
    '01': (report) => {
      return renderReportNew(report, '01');
    },
    '02': (report) => {
      return renderReportNew(report, '02');
    },
    '03': (report) => {
      return renderReportNew(report, '03');
    },
    '04': (report) => {
      return renderReportNew(report, '04');
    },
    '05': (report) => {
      return renderReportNew(report, '05');
    },
    '06': (report) => {
      return renderReportNew(report, '06');
    },
    '07': (report) => {
      return renderReportNew(report, '07');
    },
    '08': (report) => {
      return renderReportNew(report, '08');
    },
    '09': (report) => {
      return renderReportNew(report, '09');
    },
    '10': (report) => {
      return renderReportNew(report, '10');
    },
    '11': (report) => {
      return renderReportNew(report, '11');
    },
    '12': (report) => {
      return renderReportNew(report, '12');
    },
  };

  const createCheckBoxEntry = (stat, key) => {
    if (isNil(stat[key])) {
      return null;
    }
    if (key === 'report') {
      return stat.report;
    }

    return {
      id: stat[key].id,
    };
  };

  /**
   * We need to duplicate each line in the table.
   * This line will contain checkboxes to select certain reports.
   */
  const preprocessReports = (reports) => {
    if (isNil(reports)) {
      return null;
    }
    const newReports = [];
    reports.forEach(r => {
      const newReport = { ...r };
      const stats = r.stats;
      const newStats = [];
      // need to duplicate each line to display checkboxes
      stats.forEach((s) => {
        newStats.push({ ...s });
        const checkBoxes = {
          'report': createCheckBoxEntry(s, 'report'),
          '01': createCheckBoxEntry(s, '01'),
          '02': createCheckBoxEntry(s, '02'),
          '03': createCheckBoxEntry(s, '03'),
          '04': createCheckBoxEntry(s, '04'),
          '05': createCheckBoxEntry(s, '05'),
          '06': createCheckBoxEntry(s, '06'),
          '07': createCheckBoxEntry(s, '07'),
          '08': createCheckBoxEntry(s, '08'),
          '09': createCheckBoxEntry(s, '09'),
          '10': createCheckBoxEntry(s, '10'),
          '11': createCheckBoxEntry(s, '11'),
          '12': createCheckBoxEntry(s, '12'),
          'checkbox': true
        };
        newStats.push(checkBoxes);
      });
      newReport.stats = newStats;
      newReports.push(newReport);
    });
    return newReports;
  };

  const renderStatsAccordions = (reports) => {
    let counterStats = null;

    if (isStatsLoading) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }

    const processedReports = preprocessReports(reports);

    // if (counterReports.length > 0) {
    if (!isNil(reports) && reports.length > 0) {
      counterStats = (
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <Accordion id="counter-reports-accordion" label="COUNTER">
              <CounterStatistics
                infoText={<FormattedMessage id="ui-erm-usage.statistics.multi.delete.infoText" />}
                stripes={stripes}
                providerId={providerId}
                reports={processedReports}
                handlers={handlers}
                reportFormatter={reportFormatter}
                showMultiMonthDownload={false}
              />
            </Accordion>
          </Col>
        </Row>
      );
    }

    if (isNil(counterStats)) {
      return <FormattedMessage id="ui-erm-usage.statistics.noStats" />;
    }

    return (
      <AccordionSet>
        {counterStats}
      </AccordionSet>
    );
  };

  return renderStatsAccordions(counterReports);
}

DeleteStatistics.propTypes = {
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handlers: PropTypes.shape({}),
  isStatsLoading: PropTypes.bool.isRequired,
  maxFailedAttempts: PropTypes.number.isRequired,
  providerId: PropTypes.string.isRequired,
  reportsToDelete: PropTypes.shape().isRequired,
  addToReportsToDelete: PropTypes.func.isRequired,
  removeFromReportsToDelete: PropTypes.func.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default stripesConnect(DeleteStatistics);
