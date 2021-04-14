import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNil } from 'lodash';
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
import createStandardReportFormatter from './StandardReportFormatter';
import css from './Statistics.css';

function Statistics({
  counterReports,
  customReports,
  handlers,
  isStatsLoading,
  providerId,
  maxFailedAttempts,
  stripes,
  udpLabel,
}) {
  const reportFormatter = createStandardReportFormatter(handlers, maxFailedAttempts, stripes, udpLabel);

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

Statistics.propTypes = {
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handlers: PropTypes.shape({}),
  isStatsLoading: PropTypes.bool.isRequired,
  maxFailedAttempts: PropTypes.number.isRequired,
  providerId: PropTypes.string.isRequired,
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
