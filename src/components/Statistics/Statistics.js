import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  Icon,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import CounterStatistics from './Counter';
import CustomStatistics from './Custom';
import ReportInfoButton from './Counter/ReportInfoButton';
import css from './Statistics.css';
import { MAX_FAILED_ATTEMPTS } from '../../util/constants';

function Statistics(props) {
  const {
    stripes,
    providerId,
    udpLabel,
    counterReports,
    customReports,
    isStatsLoading,
    handlers,
    counterReportsPerYear
  } = props;

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
  //       <ReportInfoButton
  //         report={r}
  //         stripes={props.stripes}
  //         maxFailedAttempts={maxFailed}
  //         udpLabel={props.udpLabel}
  //         handlers={props.handlers}
  //       />
  //     );
  //   });
  //   while (maxMonth < 12) {
  //     const newMonth = maxMonth + 1;
  //     const monthPadded = newMonth.toString().padStart(2, '0');
  //     o[monthPadded] = (
  //       <ReportInfoButton
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

  const reportFormatter = {
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
                showMultiMonthDownload
                reportFormatter={reportFormatter}
                counterReportsPerYear={counterReportsPerYear}
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
  const reports = counterReportsPerYear;
  return renderStatsAccordions(reports);
}

Statistics.manifest = Object.freeze({
  failedAttemptsSettings: {
    type: 'okapi',
    records: 'configs',
    path:
      'configurations/entries?query=(module=ERM-USAGE-HARVESTER and configName=maxFailedAttempts)',
  },
});

Statistics.propTypes = {
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

export default stripesConnect(Statistics);
