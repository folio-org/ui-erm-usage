import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  AccordionSet,
  Col,
  Row
} from '@folio/stripes/components';
import StatisticsPerYear from './StatisticsPerYear';
import DownloadRange from './DownloadRange';
import groupByYearAndReport from './groupByYearAndReport';
import reportDownloadTypes from '../../util/data/reportDownloadTypes';
import css from './Statistics.css';

class Statistics extends React.Component {
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
    providerId: PropTypes.string.isRequired,
    udpLabel: PropTypes.string.isRequired,
    counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedDownloadRange = props.stripes.connect(DownloadRange);
    this.connectedStatsPerYear = props.stripes.connect(StatisticsPerYear);
  }

  calcDownloadableReportTypes = (counterReports) => {
    const reportNames = counterReports.filter(cr => !(cr.failedAttempts) || cr.failedAttempts === 0).map(cr => cr.reportName);
    const available = new Set(reportNames);
    const intersection = new Set(
      reportDownloadTypes.filter(y => available.has(y.value))
    );
    return _.sortBy([...intersection], ['label']);
  }

  render() {
    const { counterReports } = this.props;
    const stats = groupByYearAndReport(counterReports);
    const uniqueReports = this.calcDownloadableReportTypes(counterReports);

    return (
      <React.Fragment>
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <hr />
            <div className={css.sub2Headings}>
              <FormattedMessage id="ui-erm-usage.reportOverview.reportsPerYear" />
            </div>
          </Col>
          <Col xs={12}>
            <AccordionSet>
              <this.connectedStatsPerYear
                stats={stats}
                stripes={this.props.stripes}
                udpLabel={this.props.udpLabel}
              />
            </AccordionSet>
          </Col>
        </Row>
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <hr />
            <div className={css.sub2Headings}>
              <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths" />
            </div>
          </Col>
          <Col xs={12}>
            <this.connectedDownloadRange
              stripes={this.props.stripes}
              udpId={this.props.providerId}
              donwloadableReports={uniqueReports}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Statistics;
