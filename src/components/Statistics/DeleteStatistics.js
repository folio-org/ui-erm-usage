import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _, { isNil } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  Icon,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import CounterStatistics from './Counter';
import CustomStatistics from './Custom';
import ReportDeleteButton from './Counter/ReportDeleteButton/ReportDeleteButton';
import ReportInfoButton from './Counter/ReportInfoButton';
import css from './Statistics.css';
import { MAX_FAILED_ATTEMPTS } from '../../util/constants';

function DeleteStatistics(props) {
  const [reportsToDelete, setReportsToDelete] = useState(new Set());

  const addToReportsToDelete = (id) => {
    setReportsToDelete(oldReps => new Set(oldReps.add(id)));
  };

  const removeFromReportsToDelete = (id) => {
    setReportsToDelete(prev => new Set([...prev].filter(x => x !== id)));
  };

  const {
    stripes,
    providerId,
    udpLabel,
    counterReports,
    customReports,
    isStatsLoading,
    handlers,
  } = props;

  const handleClickReport = (id) => {
    // if (reportsToDelete.includes(id)) {
    if (reportsToDelete.has(id)) {
      // OLD: setReportsToDelete((oldReps) => [...oldReps, id]);
      // setReportsToDelete(reportsToDelete.filter((item) => item !== id));
      // setReportsToDelete(prev => new Set([...prev].filter(x => x !== id)));
      removeFromReportsToDelete(id);
    } else {
      // setReportsToDelete((oldReps) => [...oldReps, id]);
      // setReportsToDelete(oldReps => new Set(oldReps.add(id)));
      addToReportsToDelete(id);
    }
  };

  // const renderReportPerYear = (reports, maxFailed) => {
  //   const o = Object.create({});
  //   let maxMonth = 0;
  //   reports.forEach((r) => {
  //     o.report = r.reportName;
  //     const month = r.yearMonth.substring(5, 7);
  //     if (parseInt(month, 10) >= maxMonth) {
  //       maxMonth = parseInt(month, 10);
  //     }
  //     o[month] = (
  //       <ReportDeleteButton
  //         report={r}
  //         maxFailedAttempts={maxFailed}
  //         udpLabel={props.udpLabel}
  //         onClick={addReportToDelete}
  //         selected={reportsToDelete.includes(r.id)}
  //       />
  //     );
  //   });
  //   while (maxMonth < 12) {
  //     const newMonth = maxMonth + 1;
  //     const monthPadded = newMonth.toString().padStart(2, '0');
  //     o[monthPadded] = (
  //       <ReportDeleteButton
  //         stripes={props.stripes}
  //         maxFailedAttempts={maxFailed}
  //         udpLabel={props.udpLabel}
  //       />
  //     );
  //     maxMonth = newMonth;
  //   }
  //   return o;
  // };

  const renderReportPerYear = (reports, maxFailed) => {
    const o = Object.create({});
    let maxMonth = 0;
    reports.forEach((r) => {
      o.report = r.reportName;
      const month = r.yearMonth.substring(5, 7);
      if (parseInt(month, 10) >= maxMonth) {
        maxMonth = parseInt(month, 10);
      }
      o[month] = r;
    });
    while (maxMonth < 12) {
      const newMonth = maxMonth + 1;
      const monthPadded = newMonth.toString().padStart(2, '0');
      o[monthPadded] = null;
      maxMonth = newMonth;
    }
    return o;
  };

  const renderSelectPerYear = (reports) => {
    const selectButtons = Object.create({});
    reports.forEach((r) => {
      selectButtons.report = (
        <Checkbox checked={false} label={r.reportName} value={r.id} />
      );
      const month = r.yearMonth.substring(5, 7);
      selectButtons[month] = <Checkbox checked={false} value={r.id} />;
    });
    return selectButtons;
  };

  const extractMaxFailedAttempts = () => {
    const { resources } = props;
    const settings = resources.failedAttemptsSettings || {};
    if (_.isEmpty(settings) || settings.records.length === 0) {
      return MAX_FAILED_ATTEMPTS;
    } else {
      return settings.records[0].value;
    }
  };

  const renderAndGroupPerYear = (stats) => {
    const maxFailed = parseInt(extractMaxFailedAttempts(), 10);
    return stats.map((statsPerYear) => {
      const y = statsPerYear.year;
      const year = y.toString();
      const s = [];
      // statsPerYear.reportsPerType.forEach((reportsTyped) => {
      //   const reports = renderReportPerYear(reportsTyped.counterReports, maxFailed);
      //   const checkBoxes = renderSelectPerYear(reportsTyped.counterReports);
      //   s.push(reports);
      //   s.push(checkBoxes);
      // });
      const renderedStats = statsPerYear.reportsPerType.map((reportsTyped) => {
        return renderReportPerYear(reportsTyped.counterReports, maxFailed);
      });
      return {
        year,
        stats: renderedStats,
      };
      // return statsPerYear.reportsPerType.map((reportsTyped) => {
      //   return renderReportPerYear(reportsTyped.counterReports, maxFailed);
      // });
    });
  };

  const maxFailed = parseInt(extractMaxFailedAttempts(), 10);
  // const renderReport = (report) => (
  //   <ReportDeleteButton
  //     report={report}
  //     maxFailedAttempts={maxFailed}
  //     onClick={handleClickReport}
  //     selected={report ? reportsToDelete.includes(report.id) : false}
  //   />);

  const renderReport = (report, isCheckbox) => {
    if (isCheckbox) {
      if (_.isNil(report)) {
        return <></>;
      }
      return (
        <Checkbox
          checked={report ? reportsToDelete.has(report.id) : false}
          value={report.id}
          onChange={handleClickReport}
        />
      );
      // return (
      //   <ReportDeleteButton
      //     report={report}
      //     maxFailedAttempts={maxFailed}
      //     onClick={handleClickReport}
      //     selected={report ? reportsToDelete.has(report.id) : false}
      //   />);
    } else {
      return (
        <ReportInfoButton
          report={report}
          stripes={stripes}
          maxFailedAttempts={maxFailed}
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
        if (!_.isNil(o) && !_.isNil(o.id)) {
          reportIds.push(o.id);
        }
      });
      // const isChecked = reportIds.every(el => reportsToDelete.includes(el));
      const isChecked = reportIds.every(el => reportsToDelete.has(el));
      const handleClick = () => {
        if (isChecked) {
          // remove reports from reportsToDelete
          reportIds.forEach(id => {
            // setReportsToDelete(prev => new Set([...prev].filter(x => x !== id)));
            removeFromReportsToDelete(id);
          });
        } else {
          // add reports to reportsToDelete
          reportIds.forEach(id => {
            // setReportsToDelete(oldReps => new Set(oldReps.add(id)));
            addToReportsToDelete(id);
          });
        }
      };
      return (
        <Checkbox checked={isChecked} label={report.report} value={report.report} onChange={() => handleClick()} />
      );
    }
    return report.report;
  };

  const reportFormatter = {
    'report': (report) => renderReportName(report),
    '01': (report) => {
      const r = report['01'];
      return renderReport(r, report?.checkbox);
    },
    '02': (report) => {
      const r = report['02'];
      return renderReport(r, report?.checkbox);
    },
    '03': (report) => {
      const r = report['03'];
      return renderReport(r, report?.checkbox);
    },
    '04': (report) => {
      const r = report['04'];
      return renderReport(r, report?.checkbox);
    },
    '05': (report) => {
      const r = report['05'];
      return renderReport(r, report?.checkbox);
    },
    '06': (report) => {
      const r = report['06'];
      return renderReport(r, report?.checkbox);
    },
    '07': (report) => {
      const r = report['07'];
      return renderReport(r, report?.checkbox);
    },
    '08': (report) => {
      const r = report['08'];
      return renderReport(r, report?.checkbox);
    },
    '09': (report) => {
      const r = report['09'];
      return renderReport(r, report?.checkbox);
    },
    '10': (report) => {
      const r = report['10'];
      return renderReport(r, report?.checkbox);
    },
    '11': (report) => {
      const r = report['11'];
      return renderReport(r, report?.checkbox);
    },
    '12': (report) => {
      const r = report['12'];
      return renderReport(r, report?.checkbox);
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

  const preprocessReports = (reports) => {
    if (isNil(reports)) {
      return null;
    }
    const newReports = [];
    reports.forEach(r => {
      const newReport = Object.assign({}, r);
      const stats = r.stats;
      const newStats = [];
      // need to duplicate each line to display checkboxes
      stats.forEach((s) => {
        newStats.push(Object.assign({}, s));
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
    let nonCounterStats = null;

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
                stripes={stripes}
                providerId={providerId}
                udpLabel={udpLabel}
                counterReports={counterReports}
                tmpReports={processedReports}
                handlers={handlers}
                reportFormatter={reportFormatter}
              />
            </Accordion>
          </Col>
        </Row>
      );
    }

    if (customReports.length > 0) {
      nonCounterStats = (
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <Accordion id="custom-reports-accordion" label="Non-COUNTER">
              <CustomStatistics
                stripes={stripes}
                providerId={providerId}
                udpLabel={udpLabel}
                customReports={customReports}
                handlers={handlers}
              />
            </Accordion>
          </Col>
        </Row>
      );
    }

    if (_.isNil(counterStats) && _.isNil(nonCounterStats)) {
      return <FormattedMessage id="ui-erm-usage.statistics.noStats" />;
    }

    return (
      <AccordionSet>
        {counterStats}
        {nonCounterStats}
      </AccordionSet>
    );
  };

  // const reports = renderAndGroupPerYear(counterReports);
  const reports = props.counterReportsPerYear;
  console.log(reportsToDelete);

  return renderStatsAccordions(reports);
}

DeleteStatistics.manifest = Object.freeze({
  failedAttemptsSettings: {
    type: 'okapi',
    records: 'configs',
    path:
      'configurations/entries?query=(module=ERM-USAGE-HARVESTER and configName=maxFailedAttempts)',
  },
});

DeleteStatistics.propTypes = {
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
  providerId: PropTypes.string.isRequired,
  udpLabel: PropTypes.string.isRequired,
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({}),
  mutator: PropTypes.shape({
    failedAttemptsSettings: PropTypes.object,
  }),
  resources: PropTypes.object.isRequired,
  counterReportsPerYear: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default stripesConnect(DeleteStatistics);
