import React from 'react';
import { Field } from 'redux-form';
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
            label="Customer ID *"
            name="customerId"
            id="addudp_customerid"
            placeholder="Enter the SUSHI customer ID"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label="Requestor ID *"
            name="requestorId"
            id="addudp_requestorid"
            placeholder="Enter the SUSHI requestor ID"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4}>
          <Field
            label="API key"
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
            label="Requestor name"
            name="requestorName"
            id="addudp_reqname"
            placeholder="Enter the SUSHI requestor name"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={8}>
          <Field
            label="Requestor Mail"
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
