import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
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

  const addReportToDelete = (id) => {
    setReportsToDelete((oldReps) => [...oldReps, id]);
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
        <Checkbox
          checked={false}
          label={r.reportName}
          value={r.id}
        />
      );
      const month = r.yearMonth.substring(5, 7);
      selectButtons[month] = (
        <Checkbox
          checked={false}
          value={r.id}
        />
      );
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

  // TODO: Is this the correct structure?
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

  const reportFormatter = {
    'report': (report) => report.report,
    '01': (report) => (
      <ReportDeleteButton
        report={report['01']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '02': (report) => (
      <ReportDeleteButton
        report={report['02']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '03': (report) => (
      <ReportDeleteButton
        report={report['03']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '04': (report) => (
      <ReportDeleteButton
        report={report['04']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '05': (report) => (
      <ReportDeleteButton
        report={report['05']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '06': (report) => (
      <ReportDeleteButton
        report={report['06']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '07': (report) => (
      <ReportDeleteButton
        report={report['07']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '08': (report) => (
      <ReportDeleteButton
        report={report['08']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '09': (report) => (
      <ReportDeleteButton
        report={report['09']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '10': (report) => (
      <ReportDeleteButton
        report={report['10']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '11': (report) => (
      <ReportDeleteButton
        report={report['11']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
    '12': (report) => (
      <ReportDeleteButton
        report={report['12']}
        maxFailedAttempts={5}
        onClick={() => console.log('clicked')}
        selected
      />
    ),
  };

  const renderStatsAccordions = (reports) => {
    let counterStats = null;
    let nonCounterStats = null;

    if (isStatsLoading) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }

    if (counterReports.length > 0) {
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

  const reports = renderAndGroupPerYear(counterReports);
  // console.log(reportsToDelete);

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
};

export default stripesConnect(DeleteStatistics);
