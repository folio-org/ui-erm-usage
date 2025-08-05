import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Col, Row, TextField } from '@folio/stripes/components';

import { notRequired, required } from '../../../util/validate';

const SushiCredentialsForm = (props) => {
  const { useAggregator, values, form } = props;
  const intl = useIntl();

  const isDisableApiKey = values.harvestingConfig?.reportRelease === '4';

  return (
    <>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.credentials.customerId" />}
            name="sushiCredentials.customerId"
            id="addudp_customerid"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.customerId',
            })}
            component={TextField}
            required={!useAggregator && props.required}
            validate={!useAggregator && props.required ? required : notRequired}
            data={!useAggregator && props.required ? 1 : 0}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.credentials.requestorId" />}
            name="sushiCredentials.requestorId"
            id="addudp_requestorid"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorId',
            })}
            component={TextField}
            fullWidth
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
            }}
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.credentials.apiKey" />}
            name="sushiCredentials.apiKey"
            id="addudp_apikey"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.apiKey',
            })}
            component={TextField}
            disabled={isDisableApiKey}
            fullWidth
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.credentials.platform" />}
            name="sushiCredentials.platform"
            id="addudp_platform"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.platform',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.credentials.requestorName" />
            }
            name="sushiCredentials.requestorName"
            id="addudp_reqname"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorName',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.credentials.requestorMail" />
            }
            name="sushiCredentials.requestorMail"
            id="addudp_requestormail"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorMail',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
    </>
  );
};

SushiCredentialsForm.propTypes = {
  useAggregator: PropTypes.bool,
  values: PropTypes.shape(),
  form: PropTypes.shape(),
  required: PropTypes.bool
};

export default SushiCredentialsForm;
