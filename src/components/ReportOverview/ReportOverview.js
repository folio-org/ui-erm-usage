import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape
} from 'react-intl';
import {
  InfoPopover,
  MultiColumnList
} from '@folio/stripes/components';
import ReportDownloadButton from './ReportDownloadButton';
import groupByYearAndReport from './util';

class ReportOverview extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      path: 'counter-reports?tiny=true&query=(vendorId==%{vendorId.id} and platformId=%{platformId.id})&limit=1000',
    },
    vendorId: { id: null },
    platformId: { id: null },
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
      vendorId: PropTypes.object.isRequired,
      platformId: PropTypes.object.isRequired,
    }),
    vendorId: PropTypes.string.isRequired,
    platformId: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.props.mutator.vendorId.replace({ id: props.vendorId });
    this.props.mutator.platformId.replace({ id: props.platformId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.props.mutator.vendorId.replace({ id: this.props.vendorId });
    }
    if (this.props.platformId !== prevProps.platformId) {
      this.props.mutator.platformId.replace({ id: this.props.platformId });
    }
  }

  renderReportPerYear = (reports) => {
    const o = Object.create({});
    let maxMonth = 0;
    reports.forEach(r => {
      o.report = r.reportName;
      const month = r.month;
      if (parseInt(month, 10) >= maxMonth) {
        maxMonth = parseInt(month, 10);
      }
      o[month] = <ReportDownloadButton report={r} stripes={this.props.stripes} />;
    });
    while (maxMonth < 12) {
      const newMonth = maxMonth + 1;
      const monthPadded = newMonth.toString().padStart(2, '0');
      o[monthPadded] = <ReportDownloadButton stripes={this.props.stripes} />;
      maxMonth = newMonth;
    }
    return o;
  };

  createReportOverviewPerYear = (groupedStats) => {
    const { intl } = this.props;
    const years = _.keys(groupedStats);
    const visibleColumns = ['report', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const columnWidths = { 'report': '50px', '01': '50px', '02': '50px', '03': '50px', '04': '50px', '05': '50px', '06': '50px', '07': '50px', '08': '50px', '09': '50px', '10': '50px', '11': '50px', '12': '50px' };

    return years.map(y => {
      const currentYear = groupedStats[y];
      const reportNames = _.keys(currentYear);
      const reportsOfAYear = reportNames.map(rName => {
        const reports = currentYear[rName];
        return this.renderReportPerYear(reports);
      });
      return (
        <React.Fragment key={y}>
          <div><b>{y}</b></div>
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
        </React.Fragment>
      );
    });
  }

  renderStats = (stats) => {
    const groupedStatsByYearAndReports = groupByYearAndReport(stats);
    const groupedStats = this.createReportOverviewPerYear(groupedStatsByYearAndReports);
    return groupedStats;
  }

  render() {
    const { resources } = this.props;
    const records = (resources.counterReports || {}).records || null;

    const stats = !_.isEmpty(records) ? records[0].counterReports : [];
    const renderedStats = this.renderStats(stats);
    return (
      <React.Fragment>
        <InfoPopover content="Click a month with a green button to download corresponding report." />
        <div>
          { renderedStats }
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(ReportOverview);
