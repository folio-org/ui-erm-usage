import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  IconButton,
  MultiColumnList,
  Row,
} from '@folio/stripes-components';

import css from '../Statistics.css';

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

  const groupReportsByYear = (reports) => _.groupBy(reports, (r) => r.year);

  const perYear = groupReportsByYear(props.customReports);
  const dataPerYear = _.keys(perYear)
    .sort()
    .map((y) => {
      const data = perYear[y].map((cr) => ({
        note: cr.note,
        fileId: cr.fileId,
      }));
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
    // <Card id={entry.year} headerStart={<strong>{entry.year}</strong>}>
    <Accordion
      id={entry.year}
      key={entry.year}
      label={entry.year}
      open={yearAccordions[entry.year]}
      onToggle={handleAccordionToggle}
    >
      <MultiColumnList
        contentData={entry.data}
        formatter={{
          note: (line) => line.note,
          fileId: (line) => (
            <IconButton
              icon="document"
              onClick={() => console.log(line.fileId)}
            />
          ),
        }}
        interactive={false}
        visibleColumns={['note', 'fileId']}
      />
    </Accordion>
    // </Card>
  ));
  return (
    <>
      <Row end="xs">
        <Col xs>
          <ExpandAllButton
            accordionStatus={yearAccordions}
            onToggle={obj => setYearAccordions(obj)}
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
          <AccordionSet>{accordions}</AccordionSet>
        </Col>
      </Row>
    </>
  );
  //   return props.customReports.map((cr) => (
  //     <IconButton icon="document" onClick={console.log(cr.note)} />
  //   ));
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
};

export default CustomStatistics;
