import React from 'react';
import PropTypes from 'prop-types';
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
import isSushiWarningCode from '../../util/sushiWarningCode';

class UDPFilters extends React.Component {
  static propTypes = Object.freeze({
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
    intl: PropTypes.object
  });

  static defaultProps = {
    activeFilters: {}
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    filterGroups.forEach(filter => {
      const filterName = filter.name;
      const currentFilter = find(filterGroups, { name: filterName });
      let newValues = {};
      if (UDPFilters.isFilterDefinedLocally(currentFilter)) {
        newValues = currentFilter.values.map(key => {
          return {
            value: key.cql,
            label: key.name
          };
        });
      } else {
        newValues = UDPFilters.getRemoteDefinedFilterVals(
          props.data,
          props.intl,
          filterName
        );
      }

      arr[filterName] = newValues;

      if (
        state[filterName] &&
        arr[filterName].length !== state[filterName].length
      ) {
        newState[filterName] = arr[filterName];
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  static isFilterDefinedLocally = filter => {
    return filter && !isEmpty(filter.values);
  };

  static getRemoteDefinedFilterVals = (data, intl, filterName) => {
    const inputVals = data[`${filterName}`] || [];
    if (filterName === 'errorCodes') {
      // we need to translate numeric error codes to human readable text...
      return inputVals.map(entry => {
        return UDPFilters.translateErrorCodesFilterValues(entry, intl);
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

  static translateErrorCodesFilterValues = (entry, intl) => {
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

  state = {
    harvestingStatus: [],
    harvestVia: [],
    aggregators: [],
    hasFailedReport: [],
    tags: [],
    errorCodes: [],
    reportTypes: []
  };

  renderCheckboxFilter = (key, closedByDefault = false) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        closedByDefault={closedByDefault}
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-erm-usage.information.${key}`} />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup(key);
        }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={this.state[key]}
          name={key}
          onChange={group => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  renderTagsFilter = () => {
    const { activeFilters } = this.props;
    const tagFilters = activeFilters.tags || [];

    return (
      <Accordion
        closedByDefault
        id="clickable-tags-filter"
        displayClearButton={tagFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-erm-usage.general.tags" />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('tags');
        }}
        separator={false}
      >
        <MultiSelectionFilter
          ariaLabelledBy="clickable-tags-filter"
          dataOptions={this.state.tags}
          id="tags-filter"
          name="tags"
          onChange={e => this.props.filterHandlers.state({
            ...activeFilters,
            tags: e.values
          })
          }
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  renderErrorCodesFilter = () => {
    const { activeFilters } = this.props;
    const errorCodesFilters = activeFilters.errorCodes || [];

    return (
      <Accordion
        closedByDefault
        id="clickable-error-codes-filter"
        displayClearButton={errorCodesFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-erm-usage.general.errorCodes" />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('errorCodes');
        }}
        separator={false}
      >
        <MultiSelectionFilter
          ariaLabelledBy="clickable-error-codes-filter"
          dataOptions={this.state.errorCodes}
          id="error-codes-filter"
          name="errorCodes"
          onChange={e => this.props.filterHandlers.state({
            ...activeFilters,
            errorCodes: e.values
          })
          }
          selectedValues={errorCodesFilters}
        />
      </Accordion>
    );
  };

  renderReportTypesFiler = () => {
    const { activeFilters } = this.props;
    const reportTypesFilters = activeFilters.reportTypes || [];

    return (
      <Accordion
        closedByDefault
        id="clickable-report-types-filter"
        displayClearButton={reportTypesFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-erm-usage.general.reportTypes" />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('reportTypes');
        }}
        separator={false}
      >
        <MultiSelectionFilter
          ariaLabelledBy="clickable-report-types-filter"
          dataOptions={this.state.reportTypes}
          id="report-types-filter"
          name="reportTypes"
          onChange={e => this.props.filterHandlers.state({
            ...activeFilters,
            reportTypes: e.values
          })
          }
          selectedValues={reportTypesFilters}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('harvestingStatus')}
        {this.renderCheckboxFilter('harvestVia')}
        {this.renderCheckboxFilter('aggregators', true)}
        {this.renderReportTypesFiler()}
        {this.renderCheckboxFilter('hasFailedReport', true)}
        {this.renderTagsFilter()}
        {this.renderErrorCodesFilter()}
      </AccordionSet>
    );
  }
}

export default injectIntl(UDPFilters);
