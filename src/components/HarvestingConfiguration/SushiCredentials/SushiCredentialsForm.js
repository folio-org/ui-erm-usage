import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';
import { required } from '../../../util/validate';

function SushiCredentialsForm(props) {
  const { useAggregator } = props;

  const getValidator = () => (!useAggregator ? required : () => {});

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
            required={!useAggregator}
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
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.platform" />
            }
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
};

export default SushiCredentialsForm;
