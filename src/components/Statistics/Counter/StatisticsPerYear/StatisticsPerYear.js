import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';
import ReportButton from '../ReportButton';
import { MAX_FAILED_ATTEMPTS } from '../../../../util/constants';

function StatisticsPerYear(props) {
  const [yearAccordions, setYearAccordions] = useState({});

  useEffect(() => {
    const keys = _.keys(props.stats);
    const yearAccs = {};
    keys.forEach((y) => {
      const year = props.stats[y].year;
      const tmp = {};
      tmp[year] = false;
      yearAccs[year] = false;
    });
    setYearAccordions(yearAccs);
    return function cleanup() {
      setYearAccordions({});
    };
  }, [props.stats]);

  const handleAccordionToggle = ({ id }) => {
    const tmpAccs = _.cloneDeep(yearAccordions);
    if (!_.has(tmpAccs, id)) tmpAccs[id] = true;
    tmpAccs[id] = !tmpAccs[id];
    setYearAccordions(tmpAccs);
  };

  const renderReportPerYear = (reports, maxFailed) => {
    const o = Object.create({});
    let maxMonth = 0;
    reports.forEach((r) => {
      o.report = r.reportName;
      const month = r.yearMonth.substring(5, 7);
      if (parseInt(month, 10) >= maxMonth) {
        maxMonth = parseInt(month, 10);
      }
      o[month] = (
        <ReportButton
          report={r}
          stripes={props.stripes}
          maxFailedAttempts={maxFailed}
          udpLabel={props.udpLabel}
          handlers={props.handlers}
        />
      );
    });
    while (maxMonth < 12) {
      const newMonth = maxMonth + 1;
      const monthPadded = newMonth.toString().padStart(2, '0');
      o[monthPadded] = (
        <ReportButton
          stripes={props.stripes}
          maxFailedAttempts={maxFailed}
          udpLabel={props.udpLabel}
        />
      );
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

  const createReportOverviewPerYear = (groupedStats) => {
    const { intl } = props;
    const visibleColumns = [
      'report',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const columnWidths = {
      'report': '50px',
      '01': '50px',
      '02': '50px',
      '03': '50px',
      '04': '50px',
      '05': '50px',
      '06': '50px',
      '07': '50px',
      '08': '50px',
      '09': '50px',
      '10': '50px',
      '11': '50px',
      '12': '50px',
    };

    const maxFailed = parseInt(extractMaxFailedAttempts(), 10);
    return groupedStats.map((statsPerYear) => {
      const y = statsPerYear.year;
      const year = y.toString();
      const reportsOfAYear = statsPerYear.reportsPerType.map((reportsTyped) => {
        return renderReportPerYear(reportsTyped.counterReports, maxFailed);
      });
      return (
        <Accordion
          id={year}
          key={year}
          label={year}
          open={yearAccordions[y]}
          onToggle={handleAccordionToggle}
        >
          <MultiColumnList
            contentData={reportsOfAYear}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            interactive={false}
            columnMapping={{
              'report': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.report',
              }),
              '01': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.01',
              }),
              '02': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.02',
              }),
              '03': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.03',
              }),
              '04': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.04',
              }),
              '05': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.05',
              }),
              '06': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.06',
              }),
              '07': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.07',
              }),
              '08': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.08',
              }),
              '09': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.09',
              }),
              '10': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.10',
              }),
              '11': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.11',
              }),
              '12': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.month.12',
              }),
            }}
          />
        </Accordion>
      );
    });
  };

  if (_.isEmpty(props.stats)) {
    return null;
  }

  const reportAccordions = createReportOverviewPerYear(props.stats);
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
            accordionStatus={yearAccordions}
            id="expand-all-counter-report-years"
            onToggle={(obj) => setYearAccordions(obj)}
            setStatus={null}
            expandLabel={
              <FormattedMessage id="ui-erm-usage.reportOverview.expandAllYears" />
            }
            collapseLabel={
              <FormattedMessage id="ui-erm-usage.reportOverview.collapseAllYears" />
            }
          />
        </Col>
      </Row>
      <AccordionSet>{reportAccordions}</AccordionSet>
    </React.Fragment>
  );
}

StatisticsPerYear.manifest = Object.freeze({
  failedAttemptsSettings: {
    type: 'okapi',
    records: 'configs',
    path:
      'configurations/entries?query=(module=ERM-USAGE-HARVESTER and configName=maxFailedAttempts)',
  },
});

StatisticsPerYear.propTypes = {
  handlers: PropTypes.shape(),
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
  mutator: PropTypes.shape({
    failedAttemptsSettings: PropTypes.object,
  }),
  resources: PropTypes.object.isRequired,
  intl: PropTypes.object,
  stats: PropTypes.arrayOf(PropTypes.shape()),
  udpLabel: PropTypes.string.isRequired,
};

export default stripesConnect(injectIntl(StatisticsPerYear));
