import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';

const JobsFilter = (props) => {
  const location = useLocation();
  const { formatMessage } = useIntl();
  const history = useHistory();

  const pathId = new URLSearchParams(location.search).get('providerId');
  const stateId = location.state?.provider?.id;
  const stateLabel = location.state?.provider?.label;

  const renderCheckboxFilter = (key, closedByDefault = false) => {
    const dataOptions = props.filterGroups
      .find((e) => e.name === key)
      .values.map((a) => ({
        label: formatMessage({
          id: `ui-erm-usage.harvester.jobs.filter.${key}.${a}`,
        }),
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
        label={
          <FormattedMessage id={`ui-erm-usage.harvester.jobs.filter.${key}`} />
        }
        onClearFilter={() => {
          props.getFilterHandlers().clearGroup(key);
        }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={dataOptions}
          name={key}
          onChange={(group) => {
            props.getFilterHandlers().state({
              ...activeFilters,
              [group.name]: group.values,
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const toggleUdp = () => {
    const params = new URLSearchParams(location.search);
    if (pathId) {
      params.delete('providerId');
    } else {
      params.set('providerId', stateId);
    }
    history.push({ search: params.toString(), state: location.state });
  };

  const renderUDPFilter = () => {
    if (!stateId && !pathId) {
      return null;
    }

    const dataOptions = [
      {
        label: stateLabel || pathId,
        value: stateId || pathId,
      },
    ];

    return (
      <Accordion
        displayClearButton={!!pathId}
        header={FilterAccordionHeader}
        id="filter-accordion-udp"
        label={<FormattedMessage id="ui-erm-usage.usage-data-provider" />}
        onClearFilter={toggleUdp}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={dataOptions}
          name="udp"
          onChange={toggleUdp}
          selectedValues={pathId ? [pathId] : []}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderUDPFilter()}
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('result')}
      {renderCheckboxFilter('type')}
    </AccordionSet>
  );
};

JobsFilter.propTypes = {
  filterGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeFilters: PropTypes.object.isRequired,
  getFilterHandlers: PropTypes.func.isRequired,
};

export default JobsFilter;
