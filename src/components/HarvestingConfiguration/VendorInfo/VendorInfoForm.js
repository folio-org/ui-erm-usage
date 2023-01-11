import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Col, Select, TextField } from '@folio/stripes/components';
import {
  notRequired,
  required,
  requiredValidateUrl,
} from '../../../util/validate';

class VendorInfoForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    harvesterImpls: PropTypes.arrayOf(PropTypes.object),
    intl: PropTypes.object,
    required: PropTypes.bool
  };

  render() {
    const { disabled, harvesterImpls, intl } = this.props;

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            component={Select}
            dataOptions={harvesterImpls}
            defaultValue="cs50"
            disabled={disabled}
            fullWidth
            id="addudp_servicetype"
            key={!disabled && this.props.required ? 1 : 0}
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />}
            name="harvestingConfig.sushiConfig.serviceType"
            required={!disabled && this.props.required}
            validate={!disabled && this.props.required ? required : notRequired}
          />
        </Col>
        <Col xs={8}>
          <Field
            component={TextField}
            disabled={disabled}
            fullWidth
            id="addudp_serviceurl"
            key={!disabled && this.props.required ? 1 : 0}
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            name="harvestingConfig.sushiConfig.serviceUrl"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.vendor.url',
            })}
            required={!disabled && this.props.required}
            validate={!disabled && this.props.required ? requiredValidateUrl : notRequired}
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default injectIntl(VendorInfoForm);
