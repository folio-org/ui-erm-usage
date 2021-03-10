import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Col, Select, TextField } from '@folio/stripes/components';
import { notRequired, required, requiredValidateUrl } from '../../../util/validate';

class VendorInfoForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    harvesterImpls: PropTypes.arrayOf(PropTypes.object),
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

  render() {
    const { disabled, harvesterImpls } = this.props;

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />
            }
            name="harvestingConfig.sushiConfig.serviceType"
            id="addudp_servicetype"
            placeholder="Select the vendor's API type"
            component={Select}
            dataOptions={harvesterImpls}
            disabled={disabled}
            required={!disabled}
            validate={this.isRequired}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            name="harvestingConfig.sushiConfig.serviceUrl"
            id="addudp_serviceurl"
            placeholder="Enter the vendor's serviceURL"
            component={TextField}
            disabled={disabled}
            required={!disabled}
            validate={requiredValidateUrl}
            fullWidth
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default VendorInfoForm;
