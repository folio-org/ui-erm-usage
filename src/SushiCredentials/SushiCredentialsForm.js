import React from 'react';
import { Field } from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Col,
  Row,
  TextField
} from '@folio/stripes/components';

const SushiCredentialsForm = () => {
  return (
    <React.Fragment>
      <Row>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.customerId">
                {(msg) => msg + ' *'}
              </FormattedMessage>
            }
            name="customerId"
            id="addudp_customerid"
            placeholder="Enter the SUSHI customer ID"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={
              <FormattedMessage id="ui-erm-usage.sushiCreds.requestorId">
                {(msg) => msg + ' *'}
              </FormattedMessage>
            }
            name="requestorId"
            id="addudp_requestorid"
            placeholder="Enter the SUSHI requestor ID"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.apiKey" />}
            name="apiKey"
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
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorName" />}
            name="requestorName"
            id="addudp_reqname"
            placeholder="Enter the SUSHI requestor name"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={8}>
          <Field
            label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorMail" />}
            name="requestorMail"
            id="addudp_requestormail"
            placeholder="Enter the SUSHI requestor mail"
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SushiCredentialsForm;
