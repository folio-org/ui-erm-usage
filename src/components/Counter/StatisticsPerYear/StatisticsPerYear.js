import PropTypes from 'prop-types';
import { cloneDeep, has, isEmpty, keys } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

function StatisticsPerYear({ infoText, intl, reportFormatter, reports }) {
  const [yearAccordions, setYearAccordions] = useState({});
  const prevYearAccordions = useRef();

  useEffect(() => {
    prevYearAccordions.current = yearAccordions;
    const idx = keys(reports);
    const yearAccs = {};
    idx.forEach((y) => {
      const year = reports[y].year;
      yearAccs[year] = prevYearAccordions.current[year]
        ? prevYearAccordions.current[year]
        : false;
    });
    setYearAccordions(yearAccs);
    return function cleanup() {
      setYearAccordions({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  const handleAccordionToggle = ({ id }) => {
    const tmpAccs = cloneDeep(yearAccordions);
    if (!has(tmpAccs, id)) tmpAccs[id] = true;
    tmpAccs[id] = !tmpAccs[id];
    setYearAccordions(tmpAccs);
  };

  const groupByRelease = (data) => {
    const transformed = [];

    data.forEach((item) => {
      const releases = {};

      Object.keys(item).forEach((key) => {
        if (key === 'report') return;

        const reportItem = item[key];

        if (!reportItem) return;

        const release = reportItem.release;

        if (!releases[release]) {
          releases[release] = {
            report: item.report,
            release: release,
          };
        }

        releases[release][key] = reportItem;
      });

      Object.values(releases).forEach((releaseGroup) => {
        transformed.push(releaseGroup);
      });
    });
    return transformed;
  };

  const createReportOverviewPerYear = () => {
    const visibleColumns = [
      'report',
      'release',
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
      'report': '65px',
      'release': '70px',
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

    return reports.map((statsPerYear) => {
      const y = statsPerYear.year;
      const year = y.toString();
      const reps = statsPerYear.stats;
      const reportsGroupedByRelease = groupByRelease(reps);

      return (
        <Accordion
          id={year}
          key={year}
          label={year}
          open={yearAccordions[y]}
          onToggle={handleAccordionToggle}
        >
          <MultiColumnList
            contentData={reportsGroupedByRelease}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            interactive={false}
            formatter={reportFormatter}
            columnMapping={{
              'report': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.report',
              }),
              'release': intl.formatMessage({
                id: 'ui-erm-usage.reportOverview.version',
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

  if (isEmpty(reports)) {
    return null;
  }

  const reportAccordions = createReportOverviewPerYear();
  return (
    <>
      <Row>
        <Col xs={8}>
          { infoText }
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
    </>
  );
}

StatisticsPerYear.propTypes = {
  infoText: PropTypes.node.isRequired,
  intl: PropTypes.object,
  reportFormatter: PropTypes.shape({}).isRequired,
  reports: PropTypes.arrayOf(PropTypes.shape()),
};

export default injectIntl(StatisticsPerYear);
