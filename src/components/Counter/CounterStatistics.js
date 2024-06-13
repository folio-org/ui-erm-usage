import { isEqual, sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AccordionSet, Col, Row } from '@folio/stripes/components';
import StatisticsPerYear from './StatisticsPerYear';
import DownloadRange from './DownloadRange';
import reportDownloadTypes from '../../util/data/reportDownloadTypes';
import css from './CounterStatistics.css';

class CounterStatistics extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({}),
    infoText: PropTypes.node,
    providerId: PropTypes.string.isRequired,
    reportFormatter: PropTypes.shape({}).isRequired,
    reports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    showMultiMonthDownload: PropTypes.bool,
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
  };

  static defaultProps = {
    infoText: <FormattedMessage id="ui-erm-usage.reportOverview.infoText" />
  }

  constructor(props) {
    super(props);
    this.downloadableReports = this.calcDownloadableReportTypes();
  }

  componentDidUpdate(prevProps) {
    const { reports } = this.props;
    if (!isEqual(reports, prevProps.reports)) {
      this.downloadableReports = this.calcDownloadableReportTypes();
    }
  }

  calcDownloadableReportTypes = () => {
    const reportNamesNew = this.props.reports
      .flatMap((c) => c.stats)
      .filter((cr) => !cr.failedAttempts || cr.failedAttempts === 0)
      .map((cr) => cr.report);
    const available = new Set(reportNamesNew);
    const intersection = new Set(
      reportDownloadTypes.filter((y) => available.has(y.value.split('_')[0]))
    );
    return sortBy([...intersection], ['label']);
  };

  render() {
    const { infoText, showMultiMonthDownload } = this.props;

    return (
      <>
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <hr />
            <div className={css.sub2Headings}>
              <FormattedMessage id="ui-erm-usage.reportOverview.reportsPerYear" />
            </div>
          </Col>
          <Col xs={12}>
            <AccordionSet id="data-test-counter-reports">
              <StatisticsPerYear
                infoText={infoText}
                reports={this.props.reports}
                reportFormatter={this.props.reportFormatter}
              />
            </AccordionSet>
          </Col>
        </Row>
        {showMultiMonthDownload && (
          <Row className={css.subAccordionSections}>
            <Col xs={12}>
              <hr />
              <div className={css.sub2Headings}>
                <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths" />
              </div>
            </Col>
            <Col xs={12}>
              <DownloadRange
                stripes={this.props.stripes}
                udpId={this.props.providerId}
                downloadableReports={this.downloadableReports}
                handlers={this.props.handlers}
              />
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default CounterStatistics;
