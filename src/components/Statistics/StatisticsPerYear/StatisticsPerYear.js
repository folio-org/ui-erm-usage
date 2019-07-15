import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  ExpandAllButton,
  MultiColumnList,
  Row
} from '@folio/stripes/components';
import ReportButton from '../ReportButton';
import { MAX_FAILED_ATTEMPTS } from '../../../util/constants';

class StatisticsPerYear extends React.Component {
  static manifest = Object.freeze({
    failedAttemptsSettings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ERM-USAGE-HARVESTER and configName=maxFailedAttempts)',
    },
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
    mutator: PropTypes.shape({
      failedAttemptsSettings: PropTypes.object
    }),
    resources: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    stats: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.connectedReportButton = props.stripes.connect(ReportButton);
    this.state = {
      accordions: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.stats, prevProps.stats)) {
      const years = _.keys(this.props.stats);
      years.forEach(y => {
        const tmp = {};
        tmp[y] = false;
        this.setState((state) => {
          return {
            accordions: {
              ...state.accordions,
              ...tmp,
            }
          };
        });
      });
    }
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  renderReportPerYear = (reports, maxFailed) => {
    const o = Object.create({});
    let maxMonth = 0;
    reports.forEach(r => {
      o.report = r.reportName;
      const month = r.month;
      if (parseInt(month, 10) >= maxMonth) {
        maxMonth = parseInt(month, 10);
      }
      o[month] = <this.connectedReportButton report={r} stripes={this.props.stripes} maxFailedAttempts={maxFailed} />;
    });
    while (maxMonth < 12) {
      const newMonth = maxMonth + 1;
      const monthPadded = newMonth.toString().padStart(2, '0');
      o[monthPadded] = <this.connectedReportButton stripes={this.props.stripes} maxFailedAttempts={maxFailed} />;
      maxMonth = newMonth;
    }
    return o;
  };

  createReportOverviewPerYear = (groupedStats) => {
    const { intl } = this.props;
    const years = _.keys(groupedStats);
    const visibleColumns = ['report', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const columnWidths = { 'report': '50px', '01': '50px', '02': '50px', '03': '50px', '04': '50px', '05': '50px', '06': '50px', '07': '50px', '08': '50px', '09': '50px', '10': '50px', '11': '50px', '12': '50px' };

    const maxFailed = parseInt(this.extractMaxFailedAttempts(), 10);

    return years.map(y => {
      const currentYear = groupedStats[y];
      const reportNames = _.keys(currentYear);
      const reportsOfAYear = reportNames.map(rName => {
        const reports = currentYear[rName];
        return this.renderReportPerYear(reports, maxFailed);
      });
      return (
        <Accordion
          open={this.state.accordions[y]}
          onToggle={this.handleAccordionToggle}
          label={y}
          id={y}
          key={y}
        >
          <MultiColumnList
            contentData={reportsOfAYear}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            interactive={false}
            columnMapping={{
              'report': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.report' }),
              '01': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.01' }),
              '02': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.02' }),
              '03': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.03' }),
              '04': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.04' }),
              '05': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.05' }),
              '06': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.06' }),
              '07': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.07' }),
              '08': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.08' }),
              '09': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.09' }),
              '10': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.10' }),
              '11': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.11' }),
              '12': intl.formatMessage({ id: 'ui-erm-usage.reportOverview.month.12' }),
            }}
          />
        </Accordion>
      );
    });
  }

  extractMaxFailedAttempts = () => {
    const { resources } = this.props;
    const settings = (resources.failedAttemptsSettings || {});
    if (settings.records.length === 0) {
      return MAX_FAILED_ATTEMPTS;
    } else {
      return settings.records[0].value;
    }
  }

  render() {
    if (_.isEmpty(this.props.stats)) {
      return null;
    }

    const reportAccordions = this.createReportOverviewPerYear(this.props.stats);
    return (
      <React.Fragment>
        <Row>
          <Col xs={8}>
            <FormattedMessage id="ui-erm-usage.reportOverview.infoText" />
          </Col>
        </Row>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={this.state.accordions}
              onToggle={this.handleExpandAll}
              expandLabel={<FormattedMessage id="ui-erm-usage.reportOverview.expandAllYears" />}
              collapseLabel={<FormattedMessage id="ui-erm-usage.reportOverview.collapseAllYears" />}
            />
          </Col>
        </Row>
        { reportAccordions }
      </React.Fragment>
    );
  }
}

export default injectIntl(StatisticsPerYear);
