import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

const EditSushiCredentials = ({ initialValues, expanded, onToggle, accordionId }) => {
  return (
    <Accordion
      label="SUSHI Credentials"
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs={8}>
          <Row>
            <Col xs={4}>
              <Field
                label="Customer ID"
                name="customerId"
                id="addudp_customerid"
                component={TextField}
                required
                fullWidth
              />
            </Col>
            <Col xs={4}>
              <Field
                label="Requestor Id"
                name="requestorId"
                id="addudp_requestorid"
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
                component={TextField}
                required
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
                component={TextField}
                required
                fullWidth
              />
            </Col>
            <Col xs={8}>
              <Field
                label="Requestor Mail"
                name="requestorMail"
                id="addudp_requestormail"
                component={TextField}
                required
                fullWidth
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Accordion>
  );
};

EditSushiCredentials.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
};

export default EditSushiCredentials;
