import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';
import { notRequired, required } from '../../../util/validate';

const SushiCredentialsForm = (props) => {
  const { useAggregator, values, form } = props;
  const intl = useIntl();

  const isDisableRequestorId = !!(values.harvestingConfig?.reportRelease === '5' && values.sushiCredentials?.apiKey);

  const isDisableApiKey = !!(values.harvestingConfig?.reportRelease === '4' ||
      (values.harvestingConfig?.reportRelease === '5' && values.sushiCredentials?.requestorId));

  return (
    <React.Fragment>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.customerId" />}
            name="sushiCredentials.customerId"
            id="addudp_customerid"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.customerId',
            })}
            component={TextField}
            required={!useAggregator && props.required}
            validate={!useAggregator && props.required ? required : notRequired}
            key={!useAggregator && props.required ? 1 : 0}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorId" />}
            name="sushiCredentials.requestorId"
            id="addudp_requestorid"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.requestorId',
            })}
            component={TextField}
            disabled={isDisableRequestorId}
            fullWidth
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
              if (isDisableApiKey) form.change('sushiCredentials.apiKey', undefined);
            }}
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.apiKey" />}
            name="sushiCredentials.apiKey"
            id="addudp_apikey"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.apiKey',
            })}
            component={TextField}
            disabled={isDisableApiKey}
            fullWidth
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
              if (isDisableRequestorId) form.change('sushiCredentials.requestorId', undefined);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.platform" />}
            name="sushiCredentials.platform"
            id="addudp_platform"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.platform',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.requestorName" />
            }
            name="sushiCredentials.requestorName"
            id="addudp_reqname"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.requestorName',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.requestorMail" />
            }
            name="sushiCredentials.requestorMail"
            id="addudp_requestormail"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.sushi.requestorMail',
            })}
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

SushiCredentialsForm.propTypes = {
  useAggregator: PropTypes.bool,
  values: PropTypes.shape(),
  form: PropTypes.shape(),
  required: PropTypes.bool
};

export default SushiCredentialsForm;
