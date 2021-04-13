import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty, isNil } from 'lodash';
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

function Statistics({
  counterReports,
  customReports,
  handlers,
  isStatsLoading,
  providerId,
  resources,
  stripes,
  udpLabel,
}) {
  const extractMaxFailedAttempts = () => {
    const settings = resources.failedAttemptsSettings || {};
    if (isEmpty(settings) || settings.records.length === 0) {
      return MAX_FAILED_ATTEMPTS;
    } else {
      return settings.records[0].value;
    }
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

    if (reports.length > 0) {
      counterStats = (
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <Accordion id="counter-reports-accordion" label="COUNTER">
              <CounterStatistics
                stripes={stripes}
                providerId={providerId}
                reports={reports}
                handlers={handlers}
                showMultiMonthDownload
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

    if (isNil(counterStats) && isNil(nonCounterStats)) {
      return <FormattedMessage id="ui-erm-usage.statistics.noStats" />;
    }

    return (
      <AccordionSet>
        {counterStats}
        {nonCounterStats}
      </AccordionSet>
    );
  };

  return renderStatsAccordions(counterReports);
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
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handlers: PropTypes.shape({}),
  isStatsLoading: PropTypes.bool.isRequired,
  mutator: PropTypes.shape({
    failedAttemptsSettings: PropTypes.object,
  }),
  providerId: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
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

export default stripesConnect(Statistics);
