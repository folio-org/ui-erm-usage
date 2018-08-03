import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

const EditUDPInfo = ({ initialValues, expanded, onToggle, accordionId }) => {
  return (
    <Accordion
      label="Usage Data Provider Information"
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs={8}>
          <Row>
            <Col xs={4}>
              <Field
                label="Provider Name *"
                placeholder="Enter a name to identify the usage data provider"
                name="label"
                id="addudp_providername"
                component={TextField}
                required
                fullWidth
              />
            </Col>
            <Col xs={4}>
              <Field
                label="Content Vendor Id *"
                name="vendorId"
                id="addudp_vendorid"
                placeholder="Link the content vendor"
                component={TextField}
                required
                fullWidth
              />
            </Col>
            <Col xs={4}>
              <Field
                label="Content Platform Id *"
                name="platformId"
                id="addudp_platformid"
                placeholder="Link the content platform"
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

EditUDPInfo.propTypes = {
  initialValues: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired,
};

export default EditUDPInfo;
