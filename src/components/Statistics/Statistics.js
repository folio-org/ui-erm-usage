import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  AccordionSet,
  Col,
  Row
} from '@folio/stripes/components';
import StatisticsPerYear from './StatisticsPerYear';
import groupByYearAndReport from './groupByYearAndReport';
import css from './Statistics.css';

class Statistics extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      path: 'counter-reports?tiny=true&query=(providerId==%{providerId.id})&limit=1000',
    },
    providerId: { id: null },
  });

  static propTypes = {
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
    resources: PropTypes.shape({
      counterReports: PropTypes.shape(),
    }),
    mutator: PropTypes.shape({
      providerId: PropTypes.object.isRequired,
    }),
    providerId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.mutator.providerId.replace({ id: props.providerId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.providerId !== prevProps.providerId) {
      this.props.mutator.providerId.replace({ id: this.props.providerId });
    }
  }

  render() {
    const { resources } = this.props;
    const records = (resources.counterReports || {}).records || null;
    const counterReports = !_.isEmpty(records) ? records[0].counterReports : [];
    const stats = groupByYearAndReport(counterReports);

    return (
      <React.Fragment>
        <Row>
          <Col xs={8}>
            <div>Overview about harvested statistics per year. Expand a year and click a colored button to download/delete report or get additional info. </div>
            <div>Note: Currently CSV download is possible for Counter 4 JR1 reports only.</div>
          </Col>
        </Row>
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <AccordionSet>
              <StatisticsPerYear stats={stats} stripes={this.props.stripes} />
            </AccordionSet>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Statistics;
