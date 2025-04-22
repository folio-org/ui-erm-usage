import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../util/validate';
import statusOptions from '../../util/data/statusOptions';
import useTranslateLabels from '../../util/hooks/useTranslateLabels';

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
      <Row>
        <Col xs={4}>
          <Field
            component={Select}
            dataOptions={useTranslateLabels(statusOptions)}
            defaultValue="active"
            id="addudp_providerstatus"
            label={<FormattedMessage id="ui-erm-usage.information.providerStatus" />}
            name="status"
            required
            validate={required}
          />
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
