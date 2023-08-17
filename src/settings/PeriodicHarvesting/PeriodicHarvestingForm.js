import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
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
import { Field } from 'react-final-form';
import stripesFinalForm from '@folio/stripes/final-form';
import { required } from '../../util/validate';
import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';
import { formatDateTime } from '../../util/dateTimeProcessing';

class PeriodicHarvestingForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape(),
    intl: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
    };
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  };

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.props.onDelete();
    }
    this.setState({ confirmDelete: false });
  };

  render() {
    const { handleSubmit, initialValues, intl: { locale, formatMessage, timeZone } } = this.props;
    const isDeleteButtonDisabled = !initialValues.startAt;
    const lastTriggeredAt = formatDateTime(initialValues.lastTriggeredAt, locale, timeZone);

    return (
      <>
        <form id="form-periodic-harvesting" onSubmit={handleSubmit}>
          <Row>
            <Col xs={8}>
              <Field
                label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.date" />
                }
                aria-label={formatMessage({
                  id: 'ui-erm-usage.settings.harvester.config.periodic.start.date',
                })}
                name="date"
                id="periodic-harvesting-start"
                component={Datepicker}
                outputFormatter={({ value }) => value}
                validate={required}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <Field
                name="time"
                label={formatMessage({
                  id: 'ui-erm-usage.settings.harvester.config.periodic.start.time',
                })}
                component={Timepicker}
                outputFormatter={({ value }) => value}
                validate={required}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <Field
                label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.periodicInterval" />
                }
                name="periodicInterval"
                id="periodic-harvesting-interval"
                component={Select}
                dataOptions={periodicHarvestingIntervals.map(
                  ({ label, value }) => ({
                    label: formatMessage({ id: label }),
                    value,
                  })
                )}
                initialValue={
                  initialValues.periodicInterval ||
                  periodicHarvestingIntervals[0].value
                }
                fullWidth
                validate={required}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.lastTriggered" />
                }
                value={lastTriggeredAt}
              />
            </Col>
          </Row>
          <PaneMenu>
            <IfPermission perm="ui-erm-usage.generalSettings.manage">
              <Button
                id="clickable-delete-config"
                title="DELETE"
                buttonStyle="danger"
                onClick={this.beginDelete}
                disabled={isDeleteButtonDisabled}
                marginBottom0
              >
                <FormattedMessage id="ui-erm-usage.general.delete" />
              </Button>
            </IfPermission>
            <Button
              id="save-config"
              type="submit"
              title="Save"
              buttonStyle="primary paneHeaderNewButton"
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.save" />
            </Button>
          </PaneMenu>
        </form>
        <ConfirmationModal
          id="delete-config-confirmation"
          open={this.state.confirmDelete}
          heading={
            <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.confirmDelete" />
          }
          message={
            <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.deleteQuestion" />
          }
          onConfirm={() => {
            this.confirmDelete(true);
          }}
          onCancel={() => {
            this.confirmDelete(false);
          }}
        />
      </>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  subscription: {
    values: true,
    invalid: true,
  },
})(injectIntl(PeriodicHarvestingForm));
