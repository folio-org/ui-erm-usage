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
import css from './Statistics.css';
import { MAX_FAILED_ATTEMPTS } from '../../util/constants';

function DeleteStatistics(props) {
  const [reportsToDelete, setReportsToDelete] = useState([]);

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
    if (reportsToDelete.includes(id)) {
      setReportsToDelete((oldReps) => [...oldReps, id]);
      setReportsToDelete(reportsToDelete.filter((item) => item !== id));
    } else {
      setReportsToDelete((oldReps) => [...oldReps, id]);
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
  const renderReport = (report) => (
    <ReportDeleteButton
      report={report}
      maxFailedAttempts={maxFailed}
      onClick={handleClickReport}
      selected={report ? reportsToDelete.includes(report.id) : false}
    />);

  const reportFormatter = {
    'report': (report) => report.report,
    '01': (report) => {
      const r = report['01'];
      return renderReport(r);
    },
    '02': (report) => {
      const r = report['02'];
      return renderReport(r);
    },
    '03': (report) => {
      const r = report['03'];
      return renderReport(r);
    },
    '04': (report) => {
      const r = report['04'];
      return renderReport(r);
    },
    '05': (report) => {
      const r = report['05'];
      return renderReport(r);
    },
    '06': (report) => {
      const r = report['06'];
      return renderReport(r);
    },
    '07': (report) => {
      const r = report['07'];
      return renderReport(r);
    },
    '08': (report) => {
      const r = report['08'];
      return renderReport(r);
    },
    '09': (report) => {
      const r = report['09'];
      return renderReport(r);
    },
    '10': (report) => {
      const r = report['10'];
      return renderReport(r);
    },
    '11': (report) => {
      const r = report['11'];
      return renderReport(r);
    },
    '12': (report) => {
      const r = report['12'];
      return renderReport(r);
    },
  };

  const renderStatsAccordions = (reports) => {
    let counterStats = null;
    let nonCounterStats = null;

    if (isStatsLoading) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }

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
                tmpReports={reports}
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
