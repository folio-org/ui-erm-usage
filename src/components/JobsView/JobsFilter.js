import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const JobsFilter = ({
  activeFilters,
  filterGroups,
  filterHandlers,
}) => {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage } = useIntl();

  const pathId = new URLSearchParams(location.search).get('providerId');
  const stateId = location.state?.provider?.id;
  const stateLabel = location.state?.provider?.label;

  const getDataOptions = (key) => filterGroups
    .find((e) => e.name === key)
    .values.map((value) => ({
      label: formatMessage({ id: `ui-erm-usage.harvester.jobs.filter.${key}.${value}` }),
      value,
    }));

  const renderCheckboxFilter = (key, closedByDefault = false) => (
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      dataOptions={getDataOptions(key)}
      filterHandlers={filterHandlers}
      filterKey={key}
      label={<FormattedMessage id={`ui-erm-usage.harvester.jobs.filter.${key}`} />}
    />
  );

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
  activeFilters: PropTypes.object.isRequired,
  filterGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterHandlers: PropTypes.shape({
    clearGroup: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
};

export default JobsFilter;
