import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
import {
  required
} from '../../util/validate';

function UDPInfoForm(props) {
  const { expanded, onToggle, accordionId } = props;

  return (
    <Accordion
      label={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.title" />}
      open={expanded}
      id={accordionId}
      onToggle={onToggle}
    >
      <Row>
        <Col xs>
          <Row>
            <Col xs={4}>
              <Field
                label={
                  <FormattedMessage id="ui-erm-usage.information.providerName">
                    {(msg) => msg + ' *'}
                  </FormattedMessage>}
                placeholder="Enter a name to identify the usage data provider"
                name="label"
                id="addudp_providername"
                component={TextField}
                validate={required}
                fullWidth
              />
            </Col>
            <Col xs={4}>
              <Field
                label={<FormattedMessage id="ui-erm-usage.general.description" />}
                name="description"
                id="addudp_description"
                placeholder="Description of the usage data provider"
                component={TextField}
                fullWidth
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Accordion>
  );
}

UDPInfoForm.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  accordionId: PropTypes.string.isRequired
};

export default UDPInfoForm;
