import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Col, Row, TextField } from '@folio/stripes/components';

import { required } from '../../util/validate';

function UDPInfoForm(props) {
  const { expanded, onToggle, accordionId } = props;
  const intl = useIntl();

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
                  <FormattedMessage id="ui-erm-usage.information.providerName" />
                }
                placeholder={intl.formatMessage({
                  id: 'ui-erm-usage.udp.form.placeholder.udpName',
                })}
                name="label"
                id="addudp_providername"
                component={TextField}
                required
                validate={required}
                fullWidth
              />
            </Col>
            <Col xs={8}>
              <Field
                label={
                  <FormattedMessage id="ui-erm-usage.general.description" />
                }
                name="description"
                id="addudp_description"
                placeholder={intl.formatMessage({
                  id: 'ui-erm-usage.udp.form.placeholder.udpDescription',
                })}
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
  accordionId: PropTypes.string.isRequired,
};

export default UDPInfoForm;
