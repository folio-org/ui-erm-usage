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

class VendorInfoForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
  };

  render() {
    let requiredSign = ' *';
    if (this.props.disabled) {
      requiredSign = '';
    }

    const serviceTypeOptions =
      [
        { value: 'cs41', label: 'COUNTER-SUSHI 4' },
        // { value: 'cs5', label: 'COUNTER-SUSHI 5' },
      ];

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
            dataOptions={serviceTypeOptions}
            disabled={this.props.disabled}
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
            disabled={this.props.disabled}
            fullWidth
          />
        </Col>
      </React.Fragment>);
  }
}

export default VendorInfoForm;
