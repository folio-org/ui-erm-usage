import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Col,
  ConfirmationModal,
  Datepicker,
  IconButton,
  KeyValue,
  PaneMenu,
  Row,
  Select,
  Timepicker,
} from '@folio/stripes/components';
import { Field } from 'react-final-form';
import moment from 'moment-timezone';
import stripesFinalForm from '@folio/stripes/final-form';
import { required } from '../../util/validate';
import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';

class PeriodicHarvestingForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape(),
    onDelete: PropTypes.func.isRequired,
    timeZone: PropTypes.string.isRequired,
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

  getLastMenu() {
    return (
      <IconButton
        icon="times-circle"
        id="clickable-edit-config"
        onClick={this.onEndEdit}
        aria-label="End edit periodic harvesting config"
      />
    );
  }

  render() {
    const { handleSubmit, initialValues } = this.props;
    const isConfigEmpty = _.isEmpty(initialValues);
    const lastTriggeredAt = initialValues.lastTriggeredAt
      ? moment(initialValues.lastTriggeredAt).format('LLL')
      : '--';

    return (
      <React.Fragment>
        <form id="form-periodic-harvesting" onSubmit={handleSubmit}>
          <Row>
            <Col xs={8}>
              <Field
                label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.date" />
                }
                aria-label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.date" />
                }
                name="startDate"
                id="periodic-harvesting-start"
                component={Datepicker}
                dateFormat="YYYY-MM-DD"
                backendDateStandard="YYYY-MM-DD"
                validate={required}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <Field
                name="startTime"
                label={
                  <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.time" />
                }
                component={Timepicker}
                autoComplete="off"
                timeZone={this.props.timeZone}
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
                dataOptions={periodicHarvestingIntervals}
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
            <Button
              id="clickable-delete-config"
              title="DELETE"
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={isConfigEmpty}
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
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
            <FormattedMessage id="ui-erm-usage.reportOverview.confirmDelete" />
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
      </React.Fragment>
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
})(PeriodicHarvestingForm);
