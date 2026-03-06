import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  notRequired,
  required,
} from '../../../util/validate';

const SushiCredentialsForm = (props) => {
  const { useAggregator, values, form } = props;
  const intl = useIntl();

  const isDisableApiKey = values.harvestingConfig?.reportRelease === '4';

  return (
    <>
      <Row>
        <Col xs={4}>
          <Field
            component={TextField}
            data={!useAggregator && props.required ? 1 : 0}
            fullWidth
            id="addudp_customerid"
            label={<FormattedMessage id="ui-erm-usage.credentials.customerId" />}
            name="sushiCredentials.customerId"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.customerId',
            })}
            required={!useAggregator && props.required}
            validate={!useAggregator && props.required ? required : notRequired}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_requestorid"
            label={<FormattedMessage id="ui-erm-usage.credentials.requestorId" />}
            name="sushiCredentials.requestorId"
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
            }}
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorId',
            })}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            disabled={isDisableApiKey}
            fullWidth
            id="addudp_apikey"
            label={<FormattedMessage id="ui-erm-usage.credentials.apiKey" />}
            name="sushiCredentials.apiKey"
            onChange={(e) => {
              form.change(e.target.name, e.target.value);
            }}
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.apiKey',
            })}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_platform"
            label={<FormattedMessage id="ui-erm-usage.credentials.platform" />}
            name="sushiCredentials.platform"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.platform',
            })}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_reqname"
            label={
              <FormattedMessage id="ui-erm-usage.credentials.requestorName" />
            }
            name="sushiCredentials.requestorName"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorName',
            })}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_requestormail"
            label={
              <FormattedMessage id="ui-erm-usage.credentials.requestorMail" />
            }
            name="sushiCredentials.requestorMail"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.requestorMail',
            })}
          />
        </Col>
      </Row>
    </>
  );
};

SushiCredentialsForm.propTypes = {
  form: PropTypes.shape(),
  required: PropTypes.bool,
  useAggregator: PropTypes.bool,
  values: PropTypes.shape(),
};

export default SushiCredentialsForm;
