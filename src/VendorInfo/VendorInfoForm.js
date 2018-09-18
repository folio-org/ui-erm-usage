import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import { Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';

class VendorInfoForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
  };

  render() {
    const serviceTypeOptions =
      [
        { value: 'SUSHI', label: 'SUSHI' },
        { value: 'SUSHI lite', label: 'SUHSI lite' },
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
