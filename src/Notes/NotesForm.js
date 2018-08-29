import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextArea from '@folio/stripes-components/lib/TextArea';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

const NotesForm = ({ expanded, onToggle, accordionId }) => {
  return (
    <Accordion
      label="Notes"
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs={12}>
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
