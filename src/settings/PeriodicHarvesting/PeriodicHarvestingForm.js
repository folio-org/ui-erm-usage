import PropTypes from 'prop-types';
import { useState } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  Col,
  ConfirmationModal,
  Datepicker,
  KeyValue,
  PaneMenu,
  Row,
  Select,
  Timepicker,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';
import { formatDateTime } from '../../util/dateTimeProcessing';
import { required } from '../../util/validate';

const PeriodicHarvestingForm = ({
  handleSubmit,
  initialValues,
  intl,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const beginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (confirmation) {
      onDelete();
    }

    setConfirmDelete(false);
  };

  const isDeleteButtonDisabled = !initialValues.startAt;
  const lastTriggeredAt = formatDateTime(initialValues.lastTriggeredAt, intl.locale, intl.timeZone);

  return (
    <>
      <form id="form-periodic-harvesting" onSubmit={handleSubmit}>
        <Row>
          <Col xs={8}>
            <Field
              aria-label={intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.date' })}
              component={Datepicker}
              id="periodic-harvesting-start"
              label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.date" />}
              name="date"
              outputFormatter={({ value }) => value}
              validate={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Timepicker}
              label={intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.time' })}
              name="time"
              outputFormatter={({ value }) => value}
              validate={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={periodicHarvestingIntervals.map(
                ({ label, value }) => ({
                  label: intl.formatMessage({ id: label }),
                  value,
                })
              )}
              fullWidth
              id="periodic-harvesting-interval"
              initialValue={
                initialValues.periodicInterval ||
                periodicHarvestingIntervals[0].value
              }
              label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.periodicInterval" />}
              name="periodicInterval"
              validate={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.lastTriggered" />}
              value={lastTriggeredAt}
            />
          </Col>
        </Row>
        <PaneMenu>
          <IfPermission perm="ui-erm-usage.generalSettings.manage">
            <Button
              buttonStyle="danger"
              disabled={isDeleteButtonDisabled}
              id="clickable-delete-config"
              marginBottom0
              onClick={beginDelete}
              title="DELETE"
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
          </IfPermission>
          <Button
            buttonStyle="primary paneHeaderNewButton"
            id="save-config"
            marginBottom0
            title="Save"
            type="submit"
          >
            <FormattedMessage id="ui-erm-usage.general.save" />
          </Button>
        </PaneMenu>
      </form>
      <ConfirmationModal
        heading={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.confirmDelete" />}
        id="delete-config-confirmation"
        message={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.deleteQuestion" />}
        onCancel={() => { doConfirmDelete(false); }}
        onConfirm={() => { doConfirmDelete(true); }}
        open={confirmDelete}
      />
    </>
  );
};

PeriodicHarvestingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape(),
  intl: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  subscription: {
    values: true,
    invalid: true,
  },
})(injectIntl(PeriodicHarvestingForm));
