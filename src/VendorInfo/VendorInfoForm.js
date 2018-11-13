import React from 'react';
import PropTypes from 'prop-types';
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
    const serviceTypeOptions =
      [
        { value: 'cs41', label: 'COUNTER-SUSHI 4' },
        // { value: 'cs5', label: 'COUNTER-SUSHI 5' },
      ];

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            label="Service type *"
            name="serviceType"
            id="addudp_servicetype"
            placeholder="Select the vendor's API"
            component={Select}
            dataOptions={serviceTypeOptions}
            disabled={this.props.disabled}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label="Service URL"
            name="serviceUrl"
            id="addudp_serviceurl"
            placeholder="Enter the vendor's service URL"
            component={TextField}
            disabled={this.props.disabled}
            fullWidth
          />
        </Col>
      </React.Fragment>);
  }
}

export default VendorInfoForm;
