import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';
import { required } from '../../../util/validate';

function SushiCredentialsForm(props) {
  const { useAggregator, values } = props;

  const isCustIdRequired = () => {
    if (!useAggregator) {
      return true;
    }

    const isValueDefined =
      _.get(values, 'sushiCredentials.requestorId', false) ||
      _.get(values, 'sushiCredentials.apiKey', false) ||
      _.get(values, 'sushiCredentials.platform', false) ||
      _.get(values, 'sushiCredentials.requestorName', false) ||
      _.get(values, 'sushiCredentials.requestorMAil', false);

    if (useAggregator && isValueDefined) {
      return true;
    }
    return false;
  };

  const getValidator = () => {
    if (isCustIdRequired()) {
      return required;
    }
    return () => {};
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.customerId" />}
            name="sushiCredentials.customerId"
            id="addudp_customerid"
            placeholder="Enter the SUSHI customer ID"
            component={TextField}
            required={isCustIdRequired()}
            validate={getValidator()}
            key={useAggregator ? 1 : 0}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.requestorId">
                {(msg) => msg}
              </FormattedMessage>
            }
            name="sushiCredentials.requestorId"
            id="addudp_requestorid"
            placeholder="Enter the SUSHI requestor ID"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.apiKey" />}
            name="sushiCredentials.apiKey"
            id="addudp_apikey"
            placeholder="Enter the SUSHI API key"
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.platform" />}
            name="sushiCredentials.platform"
            id="addudp_platform"
            placeholder="Enter platform to request usage for"
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
            placeholder="Enter the SUSHI requestor name"
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
            placeholder="Enter the SUSHI requestor mail"
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
    </React.Fragment>
  );
}

SushiCredentialsForm.propTypes = {
  useAggregator: PropTypes.bool,
  values: PropTypes.shape(),
};

export default SushiCredentialsForm;
