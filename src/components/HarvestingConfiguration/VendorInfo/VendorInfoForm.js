import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Col,
  InfoPopover,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import {
  notRequired,
  required,
  requiredValidateUrl,
} from '../../../util/validate';
import css from './VendorInfoForm.css';

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
            data={!disabled && isRequired ? 1 : 0}
            dataOptions={harvesterImpls}
            disabled={disabled}
            fullWidth
            id="addudp_servicetype"
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
            data={!disabled && isRequired ? 1 : 0}
            disabled={disabled}
            fullWidth
            id="addudp_serviceurl"
            label={
              <>
                <FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />
                <InfoPopover
                  className={css.serviceUrlInfoPopover}
                  content={
                    <>
                      <FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl.info" /><br />
                      <FormattedMessage
                        id="ui-erm-usage.vendorInfo.serviceUrl.note"
                        values={{
                          // eslint-disable-next-line max-len
                          urlSushiReport: <a href="https://usage.catsanddogs.org/sushi/reports/tr_b1" rel="noopener noreferrer" target="_blank">https://usage.catsanddogs.org/sushi/reports/tr_b1</a>,
                          // eslint-disable-next-line max-len
                          urlSushi: <a href="https://usage.catsanddogs.org/sushi" rel="noopener noreferrer" target="_blank">https://usage.catsanddogs.org/sushi</a>,
                        }}
                      />
                    </>
                  }
                />
              </>
            }
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
  isRequired: PropTypes.bool,
};

export default injectIntl(VendorInfoForm);
