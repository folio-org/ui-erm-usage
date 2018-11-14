import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  IfPermission,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextField,

} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { Field } from 'redux-form';
import DisplayContactsForm from './DisplayContactsForm';
import css from './AggregatorForm.css';

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
          icon="closeX"
          title="Cancel"
          aria-label="Cancel"
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ? 'Save and close' : 'Create aggregator';

    return (
      <PaneMenu>
        {edit &&
          <IfPermission perm="settings.erm.enabled">
            <Button
              id="clickable-delete-service-point"
              title="Delete"
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
          title="Save and close"
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

    return 'New aggregator';
  }

  render() {
    const { stripes, handleSubmit, initialValues } = this.props;
    const aggregator = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.erm.enabled');
    const name = aggregator.label || '';

    const serviceTypes =
      [
        { value: 'NSS', label: 'Nationaler Statistikserver (NSS)' },
      ];

    const accountConfigTypes =
      [
        { value: 'Mail', label: 'Mail' },
        { value: 'API', label: 'API' },
        { value: 'Manual', label: 'Manual' }
      ];

    const confirmationMessage = (
      <div>{`Do you really want to delete ${name}?`}</div>
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
                label="General information"
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label="Name *"
                      name="label"
                      id="input-aggregaor-label"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <Field
                      label="Service Type *"
                      name="serviceType"
                      id="input-aggregaor-service-type"
                      placeholder="Select a service type"
                      component={Select}
                      dataOptions={serviceTypes}
                      required
                      fullWidth
                    />
                    <Field
                      label="Service URL *"
                      name="serviceUrl"
                      id="input-aggregaor-service-url"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Col>
                </Row>
              </Accordion>

              <Accordion
                open={sections.aggregatorConfig}
                id="aggregatorConfig"
                onToggle={this.handleSectionToggle}
                label="Aggregator Configuration"
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label="API Key *"
                      name="aggregatorConfig.apiKey"
                      id="input-aggregator-config-api-key"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <Field
                      label="Requestor Id *"
                      name="aggregatorConfig.requestorId"
                      id="input-aggregator-config-requestor-id"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <Field
                      label="Customer Id *"
                      name="aggregatorConfig.customerId"
                      id="input-aggregator-config-customer-id"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <Field
                      label="Report release *"
                      name="aggregatorConfig.reportRelease"
                      id="input-aggregator-config-reportRelease"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Col>
                </Row>
              </Accordion>

              <Accordion
                open={sections.accountConfig}
                id="accountConfig"
                onToggle={this.handleSectionToggle}
                label="Account Configuration"
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label="Config type *"
                      name="accountConfig.configType"
                      id="input-aggregaor-account-type"
                      placeholder="Select a config type"
                      component={Select}
                      dataOptions={accountConfigTypes}
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <Field
                      label="Config mail *"
                      name="accountConfig.configMail"
                      id="input-aggregaor-service-url"
                      component={TextField}
                      autoFocus
                      required
                      fullWidth
                      disabled={disabled}
                    />
                    <DisplayContactsForm />
                  </Col>
                </Row>
              </Accordion>

              <ConfirmationModal
                id="deleteaggregator-confirmation"
                open={confirmDelete}
                heading="Delete Aggregator"
                message={confirmationMessage}
                onConfirm={() => { this.confirmDelete(true); }}
                onCancel={() => { this.confirmDelete(false); }}
                confirmLabel="Delete Aggregator"
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
