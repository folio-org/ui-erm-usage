import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Accordion,
  Col,
  ConfirmationModal,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../util/validate';
import statusOptions, { STATUS } from '../../util/data/statusOptions';
import useTranslateLabels from '../../util/hooks/useTranslateLabels';

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
        id="change-status-modal"
        open={showStatusConflictModal}
        heading={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.changeStatusHeading" />}
        message={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.changeStatusMessage" />}
        onConfirm={() => { handleStatusConflictConfirmation(true); }}
        onCancel={() => { handleStatusConflictConfirmation(false); }}
        confirmLabel={<FormattedMessage id="ui-erm-usage.udp.form.udpInfo.setHarvestingStatusInactive" />}
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
