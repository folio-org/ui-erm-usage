import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  Col,
  ConfirmationModal,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import statusOptions, { STATUS } from '../../util/data/statusOptions';
import useTranslateLabels from '../../util/hooks/useTranslateLabels';
import { required } from '../../util/validate';

function UDPInfoForm({ accordionId, expanded, form, onToggle, values }) {
  const [showStatusConflictModal, setShowStatusConflictModal] = useState(false);

  const intl = useIntl();
  const harvestingStatus = get(values, 'harvestingConfig.harvestingStatus');

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    if (newStatus === STATUS.INACTIVE && harvestingStatus === STATUS.ACTIVE) {
      form.change('status', STATUS.INACTIVE);
      setShowStatusConflictModal(true);
    } else {
      form.change('status', newStatus);
    }
  };

  const handleStatusConflictConfirmation = (confirmation) => {
    if (confirmation) {
      form.change('harvestingConfig.harvestingStatus', STATUS.INACTIVE);
      setShowStatusConflictModal(false);
    } else {
      form.change('status', STATUS.ACTIVE);
      form.change('harvestingConfig.harvestingStatus', STATUS.ACTIVE);
      setShowStatusConflictModal(false);
    }
  };

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.title" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={4}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_providername"
            label={
              <FormattedMessage id="ui-erm-usage.information.providerName" />
            }
            name="label"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.udpName',
            })}
            required
            validate={required}
          />
        </Col>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addudp_description"
            label={
              <FormattedMessage id="ui-erm-usage.general.description" />
            }
            name="description"
            placeholder={intl.formatMessage({
              id: 'ui-erm-usage.udp.form.placeholder.udpDescription',
            })}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            component={Select}
            dataOptions={useTranslateLabels(statusOptions)}
            id="addudp_providerstatus"
            label={<FormattedMessage id="ui-erm-usage.information.status" />}
            name="status"
            onChange={handleStatusChange}
            required
            validate={required}
          />
        </Col>
      </Row>
      <ConfirmationModal
        confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.setHarvestingStatusInactive" />}
        heading={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.changeStatusHeading" />}
        id="change-status-modal"
        message={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.changeStatusMessage" />}
        onCancel={() => { handleStatusConflictConfirmation(false); }}
        onConfirm={() => { handleStatusConflictConfirmation(true); }}
        open={showStatusConflictModal}
      />
    </Accordion>
  );
}

UDPInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  form: PropTypes.shape({
    change: PropTypes.func,
  }),
  onToggle: PropTypes.func,
  values: PropTypes.object,
};

export default UDPInfoForm;
