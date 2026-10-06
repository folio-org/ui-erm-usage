import {
  find,
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { CheckboxFilterAccordion } from '@folio/stripes-leipzig-components';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { NO_SERVICE_TYPE } from '../../util/constants';
import filterGroups from '../../util/data/filterGroups';
import {
  getImplementations,
  isServiceTypeSupported,
} from '../../util/harvesterImpls';
import isSushiWarningCode from '../../util/isSushiWarningCode';

const UDPFilters = ({
  activeFilters = {},
  data,
  filterHandlers,
  intl,
}) => {
  const [filterState, setFilterState] = useState({
    harvestingStatus: [],
    hasFailedReport: [],
    tags: [],
    errorCodes: [],
    reportTypes: [],
    reportReleases: [],
    status: [],
  });

  // Labels depend on the harvester implementations, which may load after the service types
  const serviceTypeOptions = useMemo(() => {
    const implementations = getImplementations(data.harvesterImpls);
    const options = (data.serviceTypes ?? []).map(code => {
      const label = isServiceTypeSupported(data.harvesterImpls, code)
        ? implementations.find(i => i.type === code)?.name ?? code
        : intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.unsupportedValue' }, { value: code });

      return { label, value: code };
    });

    return [
      ...options,
      { label: intl.formatMessage({ id: 'ui-erm-usage.general.noServiceType' }), value: NO_SERVICE_TYPE },
    ];
  }, [data.harvesterImpls, data.serviceTypes, intl]);

  const isFilterDefinedLocally = filter => {
    return filter && !isEmpty(filter.values);
  };

  const translateErrorCodesFilterValues = (entry) => {
    const val = get(entry, 'label', entry);
    let label;

    if (isSushiWarningCode(val)) {
      label = `${intl.formatMessage({ id: 'ui-erm-usage.report.error.1' })} (${val})`;
    } else {
      label = `${intl.formatMessage({
        id: `ui-erm-usage.report.error.${val}`,
      })} (${val})`;
    }

    return {
      label,
      value: val,
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
          value: val,
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
            label: key.name,
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

  const renderCheckboxFilter = (key, closedByDefault = false) => (
    <CheckboxFilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      dataOptions={filterState[key]}
      filterHandlers={filterHandlers}
      filterKey={key}
      label={<FormattedMessage id={`ui-erm-usage.information.${key}`} />}
    />
  );

  const renderMultiSelectionFilter = (key, closedByDefault = true, dataOptions = filterState[key]) => {
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
          dataOptions={dataOptions}
          id={`filter-${key}`}
          name={key}
          onChange={group => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values,
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
      {renderCheckboxFilter('harvestingStatus')}
      {renderMultiSelectionFilter('serviceTypes', true, serviceTypeOptions)}
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
  intl: PropTypes.object,
};

export default injectIntl(UDPFilters);
