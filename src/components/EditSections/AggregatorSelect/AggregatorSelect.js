import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';

class AggregatorSelect extends React.Component {
  static manifest = Object.freeze({
    aggregators: {
      type: 'okapi',
      path: 'aggregator-settings'
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      aggregators: PropTypes.shape(),
    }),
    disabled: PropTypes.bool,
  };

  extractAggregatorSelectOptions = (aggregators) => {
    if (_.isEmpty(aggregators)) {
      return [];
    }

    return aggregators.map(a => {
      return { value: a.id, label: a.label };
    });
  }

  render() {
    const { resources, disabled } = this.props;
    const records = (resources.aggregators || {}).records || [];
    const aggregators = records.length
      ? records[0].aggregatorSettings
      : {};

    const aggOptions = this.extractAggregatorSelectOptions(aggregators);

    return (
      <Field
        label="Choose aggregator *"
        name="aggregator.id"
        id="addudp_aggid"
        placeholder="Select an aggregator"
        component={Select}
        dataOptions={aggOptions}
        disabled={disabled}
        required
        fullWidth
      />
    );
  }
}

export default AggregatorSelect;
