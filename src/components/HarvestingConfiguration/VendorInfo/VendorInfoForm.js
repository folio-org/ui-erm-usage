import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import {
  notRequired,
  required,
  requiredValidateUrl,
} from '../../../util/validate';

const VendorInfoForm = ({
  disabled,
  harvesterImpls,
  intl,
  isRequired,
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Field
            component={Select}
            dataOptions={harvesterImpls}
            defaultValue="cs50"
            disabled={disabled}
            fullWidth
            id="addudp_servicetype"
            data={!disabled && isRequired ? 1 : 0}
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />}
            name="harvestingConfig.sushiConfig.serviceType"
            required={!disabled && isRequired}
            validate={!disabled && isRequired ? required : notRequired}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            disabled={disabled}
            fullWidth
            id="addudp_serviceurl"
            data={!disabled && isRequired ? 1 : 0}
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            name="harvestingConfig.sushiConfig.serviceUrl"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.vendor.url',
            })}
            required={!disabled && isRequired}
            validate={!disabled && isRequired ? requiredValidateUrl : notRequired}
          />
        </Col>
      </Row>
    </>
  );
};

VendorInfoForm.propTypes = {
  disabled: PropTypes.bool.isRequired,
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
  intl: PropTypes.object,
  isRequired: PropTypes.bool
};

export default injectIntl(VendorInfoForm);
