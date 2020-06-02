import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSet,
  Col,
  Row
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
    customReports
  } = props;

  return (
    <AccordionSet>
      <Row className={css.subAccordionSections}>
        <Col xs={12}>
          <Accordion label="COUNTER">
            <CounterStatistics
              stripes={stripes}
              providerId={providerId}
              udpLabel={label}
              counterReports={counterReports}
            />
          </Accordion>
        </Col>
      </Row>
      <Row className={css.subAccordionSections}>
        <Col xs={12}>
          <Accordion label="Non-COUNTER">
            <CustomStatistics
              stripes={stripes}
              providerId={providerId}
              udpLabel={label}
              customReports={customReports}
            />
          </Accordion>
        </Col>
      </Row>
    </AccordionSet>
  );
}

Statistics.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func
    })
  }).isRequired,
  providerId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customReports: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Statistics;
