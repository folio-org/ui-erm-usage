import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

const SushiCredentialsForm = ({ expanded, onToggle, accordionId }) => {
  return (
    <Accordion
      label="SUSHI Credentials"
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs>
          <Row>
            <Col xs={4}>
              <Field
                label="Customer ID *"
                name="customerId"
                id="addudp_customerid"
                placeholder="Enter the SUSHI customer ID"
                component={TextField}
                required
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
                required
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
        </Col>
      </Row>
    </Accordion>
  );
};

SushiCredentialsForm.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
};

export default SushiCredentialsForm;
