import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Col,
  Select,
  TextField
} from '@folio/stripes/components';

class AggregatorInfoForm extends React.Component {
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

    const aggs = aggregators.map(a => {
      return { value: a.id, label: a.label };
    });
    return _.sortBy(aggs, ['label', 'value']);
  }

  render() {
    const { resources, disabled } = this.props;
    const records = (resources.aggregators || {}).records || [];
    const aggregators = records.length
      ? records[0].aggregatorSettings
      : {};

    const aggOptions = this.extractAggregatorSelectOptions(aggregators);

    return (
      <React.Fragment>
        <Col xs={4}>
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
        </Col>
        <Col xs={4}>
          <Field
            label="Vendor code"
            name="aggregator.vendorCode"
            id="addudp_vendorcode"
            placeholder="Enter the aggregator's vendor code"
            component={TextField}
            disabled={disabled}
            fullWidth
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default AggregatorInfoForm;
