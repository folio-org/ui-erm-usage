import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find, isEmpty } from 'lodash';

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

const FILTERS = [
  'harvestingStatus',
  'harvestVia',
  'aggregators',
  'hasFailedReport',
  'tags'
];

export default class UDPFilters extends React.Component {
  static propTypes = Object.freeze({
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object
  });

  static defaultProps = {
    activeFilters: {}
  };

  state = {
    harvestingStatus: [],
    harvestVia: [],
    aggregators: [],
    hasFailedReport: [],
    tags: []
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    FILTERS.forEach(filterName => {
      const current = find(filterGroups, { name: filterName });
      let newValues = {};
      if (current && !isEmpty(current.values)) {
        newValues = current.values.map(key => {
          return {
            value: key.cql,
            label: key.name
          };
        });
      } else {
        const inputVals = props.data[`${filterName}`] || [];
        newValues = inputVals.map(entry => ({
          label: entry.label,
          value: entry.label
        }));
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

  renderCheckboxFilter = (key, name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-erm-usage.information.${key}`} />}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup(key);
        }}
        separator={false}
        {...props}
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
        label="TAGS"
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('tags');
        }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={this.state.tags}
          id="tags-filter"
          name="tags"
          onChange={e => this.props.filterHandlers.state({
            ...activeFilters,
            tags: e.values
          })}
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('harvestingStatus', 'Harvesting status')}
        {this.renderCheckboxFilter('harvestVia', 'Harvest via')}
        {this.renderCheckboxFilter('aggregators', 'Aggregators')}
        {this.renderCheckboxFilter('hasFailedReport', 'Has failed report(s)')}
        {this.renderTagsFilter()}
      </AccordionSet>
    );
  }
}
