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
            label={
              <FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />
            }
            name="harvestingConfig.sushiConfig.serviceType"
            id="addudp_servicetype"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.vendor.apiType',
            })}
            component={Select}
            dataOptions={harvesterImpls}
            disabled={disabled}
            required={!disabled && this.props.required}
            validate={!disabled && this.props.required ? required : notRequired}
            key={!disabled && this.props.required ? 1 : 0}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            name="harvestingConfig.sushiConfig.serviceUrl"
            id="addudp_serviceurl"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.vendor.url',
            })}
            component={TextField}
            disabled={disabled}
            required={!disabled && this.props.required}
            validate={!disabled && this.props.required ? requiredValidateUrl : notRequired}
            key={!disabled && this.props.required ? 1 : 0}
            fullWidth
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default injectIntl(VendorInfoForm);
