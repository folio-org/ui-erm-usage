import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  MultiColumnList,
  Row,
} from '@folio/stripes-components';
import InfoButton from './InfoButton';

import css from './CustomStatistics.css';

function CustomStatistics(props) {
  const [yearAccordions, setYearAccordions] = useState({});

  useEffect(() => {
    const py = _.groupBy(props.customReports, (r) => r.year);
    const keys = _.keys(py);
    const yearAccs = {};
    keys.forEach((y) => {
      const tmp = {};
      tmp[y] = false;
      yearAccs[y] = false;
    });
    setYearAccordions(yearAccs);
    return function cleanup() {
      setYearAccordions({});
    };
  }, [props.customReports]);

  const { handlers, stripes, udpLabel } = props;

  const groupReportsByYear = (reports) => _.groupBy(reports, (r) => r.year);

  const perYear = groupReportsByYear(props.customReports);
  const dataPerYear = _.keys(perYear)
    .sort()
    .map((y) => {
      const data = perYear[y];
      return {
        year: y,
        data,
      };
    });

  const handleAccordionToggle = ({ id }) => {
    const tmpAccs = _.cloneDeep(yearAccordions);
    if (!_.has(tmpAccs, id)) tmpAccs[id] = true;
    tmpAccs[id] = !tmpAccs[id];
    setYearAccordions(tmpAccs);
  };

  const accordions = dataPerYear.map((entry) => (
    <Accordion
      id={entry.year}
      key={entry.year}
      label={entry.year}
      open={yearAccordions[entry.year]}
      onToggle={handleAccordionToggle}
    >
      <MultiColumnList
        columnMapping={{
          note: <FormattedMessage id="ui-erm-usage.general.note" />,
          fileId: (
            <FormattedMessage id="ui-erm-usage.statistics.custom.info.detail" />
          ),
        }}
        contentData={entry.data}
        formatter={{
          note: (line) => line.note,
          fileId: (line) => (
            <InfoButton
              stripes={stripes}
              customReport={line}
              udpLabel={udpLabel}
              handlers={handlers}
            />
          ),
        }}
        interactive={false}
        visibleColumns={['note', 'fileId']}
      />
    </Accordion>
  ));
  return (
    <>
      <Row end="xs">
        <Col xs>
          <ExpandAllButton
            id="expand-all-custom-report-years"
            accordionStatus={yearAccordions}
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
      <Row className={css.subAccordionSections}>
        <Col xs={12}>
          <AccordionSet id="data-test-custom-reports">
            {accordions}
          </AccordionSet>
        </Col>
      </Row>
    </>
  );
}

CustomStatistics.propTypes = {
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
  customReports: PropTypes.arrayOf(PropTypes.shape().isRequired),
  udpLabel: PropTypes.string.isRequired,
  handlers: PropTypes.shape(),
};

export default CustomStatistics;
