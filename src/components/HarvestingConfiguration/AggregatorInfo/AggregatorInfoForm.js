import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import { Field } from 'redux-form';
import {
  Col,
  Select,
  TextField
} from '@folio/stripes/components';
import {
  notRequired,
  required
} from '../../../util/Validate';

class AggregatorInfoForm extends React.Component {
  static propTypes = {
    aggregators: PropTypes.arrayOf(PropTypes.shape()),
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.isRequired = this.props.disabled ? notRequired : required;
  }

  componentDidUpdate(prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      this.isRequired = this.props.disabled ? notRequired : required;
    }
  }

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
    const { disabled, aggregators } = this.props;
    const records = aggregators;
    const aggs = records && records.length
      ? records[0].aggregatorSettings
      : {};
    const requiredSign = disabled ? '' : ' *';
    const aggOptions = this.extractAggregatorSelectOptions(aggs);

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.information.aggregator">
                {(msg) => msg + requiredSign}
              </FormattedMessage>
            }
            name="harvestingConfig.aggregator.id"
            id="addudp_aggid"
            placeholder="Select an aggregator"
            component={Select}
            dataOptions={aggOptions}
            disabled={disabled}
            validate={[this.isRequired]}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.vendorCode" />}
            name="harvestingConfig.aggregator.vendorCode"
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
