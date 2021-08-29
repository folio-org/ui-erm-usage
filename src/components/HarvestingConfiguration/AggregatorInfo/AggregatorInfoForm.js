import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Col, Select, TextField } from '@folio/stripes/components';
import { notRequired, required } from '../../../util/validate';

class AggregatorInfoForm extends React.Component {
  static propTypes = {
    aggregators: PropTypes.arrayOf(PropTypes.shape()),
    disabled: PropTypes.bool,
    intl: PropTypes.object,
    required: PropTypes.bool
  };

  extractAggregatorSelectOptions = (aggregators) => {
    if (_.isEmpty(aggregators)) {
      return [];
    }

    const aggs = aggregators.map((a) => {
      return { value: a.id, label: a.label };
    });
    return _.sortBy(aggs, ['label', 'value']);
  };

  render() {
    const { disabled, aggregators, intl } = this.props;
    const records = aggregators;
    const aggs = records && records.length ? records[0].aggregatorSettings : {};
    const aggOptions = this.extractAggregatorSelectOptions(aggs);

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.information.aggregator" />
            }
            name="harvestingConfig.aggregator.id"
            id="addudp_aggid"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.aggregator.select',
            })}
            component={Select}
            dataOptions={aggOptions}
            disabled={disabled}
            required={!disabled && this.props.required}
            validate={!disabled && this.props.required ? required : notRequired}
            key={!disabled && this.props.required ? 1 : 0}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.vendorCode" />
            }
            name="harvestingConfig.aggregator.vendorCode"
            id="addudp_vendorcode"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.aggregator.vendor',
            })}
            component={TextField}
            disabled={disabled}
            fullWidth
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default injectIntl(AggregatorInfoForm);
