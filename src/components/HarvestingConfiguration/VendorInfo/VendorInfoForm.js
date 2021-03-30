import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Col, Select, TextField } from '@folio/stripes/components';
import {
  required,
  requiredValidateUrl,
} from '../../../util/validate';

class VendorInfoForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    harvesterImpls: PropTypes.arrayOf(PropTypes.object),
    intl: PropTypes.object,
  };

  validateUrl = (url) => {
    const { disabled } = this.props;
    if (disabled) {
      return undefined;
    }
    return requiredValidateUrl(url);
  };

  validateServiceType = (type) => {
    const { disabled } = this.props;
    if (disabled) {
      return undefined;
    }
    return required(type);
  }

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
            required={!disabled}
            validate={this.validateServiceType}
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
            required={!disabled}
            validate={requiredValidateUrl}
            fullWidth
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default injectIntl(VendorInfoForm);
