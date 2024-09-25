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

    const generateColumnMappings = () => {
      const mappings = {};

      visibleColumns.forEach((column) => {
        if (column === 'report' || column === 'release') {
          mappings[column] = intl.formatMessage({ id: `ui-erm-usage.reportOverview.${column}` });
        } else {
          mappings[column] = intl.formatMessage({ id: `ui-erm-usage.reportOverview.month.${column}` });
        }
      });

      return mappings;
    };

    return reports.map((statsPerYear) => {
      const y = statsPerYear.year;
      const year = y.toString();
      const reps = statsPerYear.stats;

      return (
        <Accordion
          id={year}
          key={year}
          label={year}
          open={yearAccordions[y]}
          onToggle={handleAccordionToggle}
        >
          <MultiColumnList
            contentData={reps}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            interactive={false}
            formatter={reportFormatter}
            columnMapping={generateColumnMappings()}
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
            expandLabel={<FormattedMessage id="ui-erm-usage.reportOverview.expandAllYears" />}
            collapseLabel={<FormattedMessage id="ui-erm-usage.reportOverview.collapseAllYears" />}
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
