import {
  cloneDeep,
  groupBy,
  has,
  keys,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import css from './CustomStatistics.css';
import InfoButton from './InfoButton';

function CustomStatistics(props) {
  const [yearAccordions, setYearAccordions] = useState({});

  useEffect(() => {
    const py = groupBy(props.customReports, (r) => r.year);
    const groupedKeys = keys(py);
    const yearAccs = {};
    groupedKeys.forEach((y) => {
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

  const groupReportsByYear = (reports) => groupBy(reports, (r) => r.year);

  const perYear = groupReportsByYear(props.customReports);
  const dataPerYear = keys(perYear)
    .sort()
    .map((y) => {
      const data = perYear[y];
      return {
        year: y,
        data,
      };
    });

  const handleAccordionToggle = ({ id }) => {
    const tmpAccs = cloneDeep(yearAccordions);
    if (!has(tmpAccs, id)) tmpAccs[id] = true;
    tmpAccs[id] = !tmpAccs[id];
    setYearAccordions(tmpAccs);
  };

  const accordions = dataPerYear.map((entry) => (
    <Accordion
      key={entry.year}
      id={entry.year}
      label={entry.year}
      onToggle={handleAccordionToggle}
      open={yearAccordions[entry.year]}
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
              customReport={line}
              handlers={handlers}
              stripes={stripes}
              udpLabel={udpLabel}
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
            accordionStatus={yearAccordions}
            collapseLabel={
              <FormattedMessage id="ui-erm-usage.reportOverview.collapseAllYears" />
            }
            expandLabel={
              <FormattedMessage id="ui-erm-usage.reportOverview.expandAllYears" />
            }
            id="expand-all-custom-report-years"
            onToggle={(obj) => setYearAccordions(obj)}
            setStatus={null}
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
  customReports: PropTypes.arrayOf(PropTypes.shape().isRequired),
  handlers: PropTypes.shape(),
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default CustomStatistics;
