import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { find, get, isEmpty } from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader
} from '@folio/stripes/components';
import {
  CheckboxFilter,
  MultiSelectionFilter
} from '@folio/stripes/smart-components';

import filterGroups from '../../util/data/filterGroups';
import isSushiWarningCode from '../../util/isSushiWarningCode';

const UDPFilters = ({
  activeFilters = {},
  data,
  filterHandlers,
  intl,
}) => {
  const [filterState, setFilterState] = useState({
    harvestingStatus: [],
    harvestVia: [],
    aggregators: [],
    hasFailedReport: [],
    tags: [],
    errorCodes: [],
    reportTypes: [],
    reportReleases: [],
  });

  const isFilterDefinedLocally = filter => {
    return filter && !isEmpty(filter.values);
  };

  const translateErrorCodesFilterValues = (entry) => {
    const val = get(entry, 'label', entry);
    let label;
    if (isSushiWarningCode(val)) {
      label = `${intl.formatMessage({
        id: 'ui-erm-usage.report.error.1'
      })} (${val})`;
    } else {
      label = `${intl.formatMessage({
        id: `ui-erm-usage.report.error.${val}`
      })} (${val})`;
    }
    return {
      label,
      value: val
    };
  };

  const getRemoteDefinedFilterVals = (filterData, filterName) => {
    const inputVals = filterData[`${filterName}`] || [];
    if (filterName === 'errorCodes') {
      // we need to translate numeric error codes to human readable text...
      return inputVals.map(entry => {
        return translateErrorCodesFilterValues(entry);
      });
    } else {
      return inputVals.map(entry => {
        const val = get(entry, 'label', entry);
        return {
          label: val,
          value: val
        };
      });
    }
  };

  useEffect(() => {
    const newState = {};
    const arr = [];

    filterGroups.forEach(filter => {
      const filterName = filter.name;
      const currentFilter = find(filterGroups, { name: filterName });
      let newValues = {};
      if (isFilterDefinedLocally(currentFilter)) {
        newValues = currentFilter.values.map(key => {
          return {
            value: key.cql,
            label: key.name
          };
        });
      } else {
        newValues = getRemoteDefinedFilterVals(data, filterName);
      }

      arr[filterName] = newValues;

      if (filterState[filterName] && arr[filterName].length !== filterState[filterName].length) {
        newState[filterName] = arr[filterName];
      }
    });

    if (Object.keys(newState).length) {
      setFilterState(prevState => ({ ...prevState, ...newState }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filterState]);

  const renderCheckboxFilter = (key, closedByDefault = false) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        closedByDefault={closedByDefault}
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-erm-usage.information.${key}`} />}
        onClearFilter={() => {
          filterHandlers.clearGroup(key);
        }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key]}
          name={key}
          onChange={group => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderMultiSelectionFilter = (key, closedByDefault = true) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        closedByDefault={closedByDefault}
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-erm-usage.general.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <MultiSelectionFilter
          ariaLabelledBy={`clickable-filter-${key}`}
          dataOptions={filterState[key]}
          id={`filter-${key}`}
          name={key}
          onChange={group => {
            filterHandlers.state({
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
      {renderCheckboxFilter('harvestingStatus')}
      {renderCheckboxFilter('harvestVia')}
      {renderCheckboxFilter('aggregators', true)}
      {renderMultiSelectionFilter('reportTypes')}
      {renderMultiSelectionFilter('reportReleases')}
      {renderCheckboxFilter('hasFailedReport', true)}
      {renderMultiSelectionFilter('tags')}
      {renderMultiSelectionFilter('errorCodes')}
    </AccordionSet>
  );
};

UDPFilters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  intl: PropTypes.object
};

export default injectIntl(UDPFilters);
