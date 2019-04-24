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

class VendorInfoForm extends React.Component {
  static manifest = Object.freeze({
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false'
    }
  });

  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    harvestingIsActive: PropTypes.bool.isRequired,
    resources: PropTypes.shape({
      harvesterImpls: PropTypes.shape(),
    }),
  };

  constructor(props) {
    super(props);
    this.isRequired = this.props.disabled ? notRequired : required;
    this.urlRequired = this.isUrlRequired() ? required : notRequired;
  }

  componentDidUpdate(prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      this.isRequired = this.props.disabled ? notRequired : required;
    }
    if ((this.props.harvestingIsActive !== prevProps.harvestingIsActive) || (this.props.disabled !== prevProps.disabled)) {
      this.urlRequired = this.isUrlRequired() ? required : notRequired;
    }
  }

  isUrlRequired = () => {
    return (!this.props.disabled && this.props.harvestingIsActive);
  }

  render() {
    const { disabled, harvestingIsActive, resources } = this.props;
    const requiredSign = disabled ? '' : ' *';
    const urlRequiredSign = harvestingIsActive ? ' *' : '';

    const records = (resources.harvesterImpls || {}).records || [];
    const implementations = records.length
      ? records[0].implementations
      : [];
    const serviceTypes = implementations.map(i => ({
      value: i.type,
      label: i.name
    }));

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.vendorInfo.serviceType">
                {(msg) => msg + requiredSign}
              </FormattedMessage>}
            name="harvestingConfig.sushiConfig.serviceType"
            id="addudp_servicetype"
            placeholder="Select the vendor's API type"
            component={Select}
            dataOptions={serviceTypes}
            disabled={this.props.disabled}
            validate={[this.isRequired]}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl">
                {(msg) => msg + urlRequiredSign}
              </FormattedMessage>
              }
            name="harvestingConfig.sushiConfig.serviceUrl"
            id="addudp_serviceurl"
            placeholder="Enter the vendor's serviceURL"
            component={TextField}
            disabled={this.props.disabled}
            validate={[this.urlRequired]}
            fullWidth
          />
        </Col>
      </React.Fragment>);
  }
}

export default VendorInfoForm;
