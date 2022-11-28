import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes-components';
import {
  CheckboxFilter,
} from '@folio/stripes-smart-components';
import { FormattedMessage, useIntl } from 'react-intl';



const JobsFilter = (props) => {
  const { formatMessage } = useIntl();
  const renderCheckboxFilter = (key, closedByDefault = false) => {
    const dataOptions = props.filterGroups
      .find((e) => e.name === key)
      .values.map((a) => ({
        label: formatMessage({ id: `ui-erm-usage.harvester.jobs.filter.${key}.${a}` }),
        value: a,
      }));
    const activeFilters = props.activeFilters.state;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        closedByDefault={closedByDefault}
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-erm-usage.harvester.jobs.filter.${key}`} />}
        onClearFilter={() => {
          props.getFilterHandlers().clearGroup(key);
        }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={dataOptions}
          name={key}
          onChange={group => {
            props.getFilterHandlers().state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('type')}
    </AccordionSet>
  );
};

JobsFilter.propTypes = {
  filterGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeFilters: PropTypes.object.isRequired,
  getFilterHandlers: PropTypes.func.isRequired
};

export default JobsFilter;
