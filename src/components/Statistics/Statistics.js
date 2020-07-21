import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  Icon,
  Row,
} from '@folio/stripes/components';
import CounterStatistics from './Counter';
import CustomStatistics from './Custom';
import css from './Statistics.css';

function Statistics(props) {
  const {
    stripes,
    providerId,
    label,
    counterReports,
    customReports,
    isStatsLoading,
  } = props;

  const renderStatsAccordions = () => {
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
                udpLabel={label}
                counterReports={counterReports}
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
                udpLabel={label}
                customReports={customReports}
              />
            </Accordion>
          </Col>
        </Row>
      );
    }

    if (_.isNil(counterStats) && _.isNil(nonCounterStats)) {
      return 'NO STATISTICS AVAILABLE';
    }

    return (
      <AccordionSet>
        {counterStats}
        {nonCounterStats}
      </AccordionSet>
    );
  };

  return renderStatsAccordions();
}

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
  label: PropTypes.string.isRequired,
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
};

export default Statistics;
