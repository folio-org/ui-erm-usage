import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextField,

} from '@folio/stripes/components';
import {
  IfPermission
} from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import { Field } from 'redux-form';
import DisplayContactsForm from './DisplayContactsForm';
import {
  required,
  mail
} from '../../util/Validate';
import css from './AggregatorForm.css';
import aggregatorServiceTypes from '../../util/data/aggregatorServiceTypes';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

class AggregatorForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);

    this.state = {
      confirmDelete: false,
      sections: {
        generalSection: true,
        accountConfig: true,
        aggregatorConfig: true
      },
    };
  }

  save(data) {
    this.props.onSave(data);
  }

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete(confirmation) {
    const aggregator = this.props.initialValues;
    if (confirmation) {
      this.props.onRemove(aggregator);
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={this.props.onCancel}
          icon="times"
          aria-label="Cancel"
        />
      </PaneMenu>
    );
  }

  createSaveLabel = edit => {
    if (!_.isEmpty(edit)) {
      return <FormattedMessage id="ui-erm-usage.aggregator.form.saveAndClose" />;
    } else {
      return <FormattedMessage id="ui-erm-usage.aggregator.form.create" />;
    }
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = this.createSaveLabel(edit);

    return (
      <PaneMenu>
        {edit &&
          <IfPermission perm="settings.erm.enabled">
            <Button
              id="clickable-delete-aggregator"
              title={<FormattedMessage id="ui-erm-usage.general.delete" />}
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              delete
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-service-point"
          type="submit"
          title={<FormattedMessage id="ui-erm-usage.aggregator.form.saveAndClose" />}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={(pristine || submitting)}
        >
          {saveLabel}
        </Button>
      </PaneMenu>
    );
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  renderPaneTitle() {
    const { initialValues } = this.props;
    const aggregator = initialValues || {};

    if (aggregator.id) {
      return (
        <div>
          <Icon size="small" icon="edit" />
          <span>
            {`Edit: ${aggregator.label}`}
          </span>
        </div>
      );
    }

    return <FormattedMessage id="ui-erm-usage.aggregator.form.newAggregator" />;
  }

  render() {
    const { stripes, handleSubmit, initialValues } = this.props;
    const aggregator = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.erm-usage.enabled');
    const name = aggregator.label || '';

    const confirmationMessage = (
      <FormattedMessage
        id="ui-erm-usage.aggregator.form.delete.confirm.message"
        values={{
          aggName: name
        }}
      />
    );

    return (
      <form id="form-service-point" className={css.AggregatorFormRoot} onSubmit={handleSubmit(this.save)}>
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={this.addFirstMenu()} lastMenu={this.saveLastMenu()} paneTitle={this.renderPaneTitle()}>
            <div className={css.AggregatorFormContent}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
                </Col>
              </Row>
              <Accordion
                open={sections.generalSection}
                id="generalSection"
                onToggle={this.handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.name">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="label"
                      id="input-aggregator-label"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.serviceType">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="serviceType"
                      id="input-aggregator-service-type"
                      placeholder="Select a service type"
                      component={Select}
                      dataOptions={aggregatorServiceTypes}
                      fullWidth
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.serviceUrl">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="serviceUrl"
                      id="input-aggregator-service-url"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                  </Col>
                </Row>
              </Accordion>

              <Accordion
                open={sections.aggregatorConfig}
                id="aggregatorConfig"
                onToggle={this.handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.apiKey">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="aggregatorConfig.apiKey"
                      id="input-aggregator-config-api-key"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.requestorId">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="aggregatorConfig.requestorId"
                      id="input-aggregator-config-requestor-id"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.customerId">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="aggregatorConfig.customerId"
                      id="input-aggregator-config-customer-id"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.reportRelease">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="aggregatorConfig.reportRelease"
                      id="input-aggregator-config-reportRelease"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                  </Col>
                </Row>
              </Accordion>

              <Accordion
                open={sections.accountConfig}
                id="accountConfig"
                onToggle={this.handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type">
                          {(msg) => msg + ' *'}
                        </FormattedMessage>
                      }
                      name="accountConfig.configType"
                      id="input-aggregator-account-type"
                      placeholder="Select a config type"
                      component={Select}
                      dataOptions={aggregatorAccountConfigTypes}
                      fullWidth
                      disabled={disabled}
                      validate={[required]}
                    />
                    <Field
                      label={
                        <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />
                      }
                      name="accountConfig.configMail"
                      id="input-aggregator-service-url"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      validate={[mail]}
                    />
                    <DisplayContactsForm {...this.props} />
                  </Col>
                </Row>
              </Accordion>

              <ConfirmationModal
                id="deleteaggregator-confirmation"
                open={confirmDelete}
                heading={<FormattedMessage id="aggregator.form.delete.confirm.title" />}
                message={confirmationMessage}
                onConfirm={() => { this.confirmDelete(true); }}
                onCancel={() => { this.confirmDelete(false); }}
                confirmLabel={<FormattedMessage id="aggregator.form.delete.confirm.title" />}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'aggreagtorForm',
  navigationCheck: true,
  enableReinitialize: true,
})(AggregatorForm);
