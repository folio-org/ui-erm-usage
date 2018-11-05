import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Accordion,
  Col,
  Row,
  TextArea
} from '@folio/stripes/components';

const NotesForm = ({ expanded, onToggle, accordionId }) => {
  return (
    <Accordion
      label="Notes"
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs>
          <Field
            label="Notes"
            name="notes"
            id="addudp_notes"
            placeholder="Enter notes"
            component={TextArea}
            fullWidth
          />
        </Col>
      </Row>
    </Accordion>);
};

NotesForm.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
};

export default NotesForm;
