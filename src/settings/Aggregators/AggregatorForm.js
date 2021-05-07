import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import { autofill, change, getFormValues, Field } from 'redux-form';
import DisplayContactsForm from './DisplayContactsForm';
import { required, mail } from '../../util/validate';
import { AggregatorConfigForm } from './AggregatorConfig';
import css from './AggregatorForm.css';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

class AggregatorForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
      }),
    }).isRequired,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    intl: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);

    const { initialValues } = this.props;
    const aggregator = initialValues || {};
    const initialAggConfig = this.parseInitialAggConfig(aggregator);

    this.state = {
      aggregatorConfigFields: initialAggConfig,
      confirmDelete: false,
      sections: {
        generalSection: true,
        accountConfig: true,
        aggregatorConfig: true,
      },
    };
  }

  getCurrentValues() {
    const { store } = this.props.stripes;
    const state = store.getState();
    return getFormValues('aggreagtorForm')(state) || {};
  }

  hasConfigType(values) {
    return (
      !_.isEmpty(values) &&
      !_.isEmpty(values.accountConfig) &&
      !_.isEmpty(values.accountConfig.configType)
    );
  }

  getSelectedConfigType() {
    const currentVals = this.getCurrentValues();
    if (this.hasConfigType(currentVals)) {
      return currentVals.accountConfig.configType;
    } else {
      return null;
    }
  }

  parseInitialAggConfig = (initialValues) => {
    const { aggregatorConfig } = initialValues;
    if (_.isNil(aggregatorConfig)) {
      return [];
    }

    return Object.keys(aggregatorConfig).map((key) => {
      const value = aggregatorConfig[key];
      return {
        key,
        value,
        isInitial: true,
      };
    });
  };

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

  getFirstMenu() {
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

  getLastMenu() {
    const { initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {edit && (
          <IfPermission perm="settings.erm-usage.enabled">
            <Button
              id="clickable-delete-aggregator"
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  }

  getPaneFooter() {
    const { pristine, submitting, invalid, onCancel } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        data-test-aggregator-form-cancel-button
        marginBottom0
        id="clickable-close-aggregator"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        data-test-aggregator-form-submit-button
        marginBottom0
        id="clickable-save-aggregator"
        buttonStyle="primary mega"
        type="submit"
        disabled={disabled}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
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

  handleAddConfigField = () => {
    this.setState(({ aggregatorConfigFields }) => ({
      aggregatorConfigFields: aggregatorConfigFields.concat({}),
    }));
  };

  handleRemoveConfigField = (index) => {
    const currentConf = this.state.aggregatorConfigFields[index];
    this.setState(
      ({ aggregatorConfigFields }) => ({
        aggregatorConfigFields: [
          ...aggregatorConfigFields.slice(0, index),
          ...aggregatorConfigFields.slice(index + 1),
        ],
      }),
      () => {
        this.props.stripes.store.dispatch(
          autofill(
            'aggreagtorForm',
            `aggregatorConfig.${currentConf.key}`,
            undefined
          )
        );
      }
    );
  };

  handleConfigFieldChange = (fieldName, index, value, fields) => {
    fields[index][fieldName] = value;
    return fields;
  };

  handleConfigChange = (field, index, e) => {
    const val = e === undefined ? 'e' : e.target.value;
    this.setState(
      (prevState) => ({
        aggregatorConfigFields: this.handleConfigFieldChange(
          field,
          index,
          val,
          prevState.aggregatorConfigFields
        ),
      }),
      () => {
        this.updateForm();
      }
    );
  };

  updateForm = () => {
    const { aggregatorConfigFields } = this.state;
    aggregatorConfigFields.forEach((entry) => {
      const k = `aggregatorConfig.${entry.key}`;
      this.changeFormValue(k, entry.value);
    });
  };

  changeFormValue = (key, value) => {
    this.props.stripes.store.dispatch(change('aggreagtorForm', key, value));
  };

  renderPaneTitle() {
    const { initialValues } = this.props;
    const aggregator = initialValues || {};

    if (aggregator.id) {
      return (
        <div>
          <Icon size="small" icon="edit" />
          <span>{`Edit: ${aggregator.label}`}</span>
        </div>
      );
    }

    return <FormattedMessage id="ui-erm-usage.aggregator.form.newAggregator" />;
  }

  render() {
    const {
      stripes,
      handleSubmit,
      initialValues,
      aggregators,
      intl,
    } = this.props;
    const aggregator = initialValues || {};
    const { aggregatorConfigFields, confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.erm-usage.enabled');
    const name = aggregator.label || '';

    const configType = this.getSelectedConfigType();
    const configTypeIsMail = configType === 'Mail';

    const configMailValidate = configTypeIsMail ? [mail, required] : [mail];

    const confirmationMessage = (
      <FormattedMessage
        id="ui-erm-usage.form.delete.confirm.message"
        values={{
          name,
        }}
      />
    );

    return (
      <form
        id="form-aggregator-setting"
        className={css.AggregatorFormRoot}
        onSubmit={handleSubmit(this.save)}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={this.getFirstMenu()}
            footer={this.getPaneFooter()}
            lastMenu={this.getLastMenu()}
            paneTitle={this.renderPaneTitle()}
          >
            <div className={css.AggregatorFormContent}>
              <AccordionSet id="aggregator-form-accordion-set">
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={sections}
                      onToggle={this.handleExpandAll}
                    />
                  </Col>
                </Row>
                <Accordion
                  open={sections.generalSection}
                  id="generalSection"
                  onToggle={this.handleSectionToggle}
                  label={
                    <FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />
                  }
                >
                  <Row>
                    <Col xs={8}>
                      <Field
                        label={
                          <FormattedMessage id="ui-erm-usage.aggregator.name" />
                        }
                        name="label"
                        id="input-aggregator-label"
                        component={TextField}
                        fullWidth
                        disabled={disabled}
                        required
                        validate={[required]}
                      />
                      <Field
                        label={
                          <FormattedMessage id="ui-erm-usage.aggregator.serviceType" />
                        }
                        name="serviceType"
                        id="input-aggregator-service-type"
                        placeholder={intl.formatMessage({
                          id:
                            'ui-erm-usage.aggregator.form.placeholder.serviceType',
                        })}
                        component={Select}
                        dataOptions={aggregators}
                        fullWidth
                        required
                        validate={[required]}
                      />
                      <Field
                        label={
                          <FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />
                        }
                        name="serviceUrl"
                        id="input-aggregator-service-url"
                        component={TextField}
                        fullWidth
                        disabled={disabled}
                        required
                        validate={[required]}
                      />
                    </Col>
                  </Row>
                </Accordion>

                <Accordion
                  open={sections.aggregatorConfig}
                  id="aggregatorConfig-form"
                  onToggle={this.handleSectionToggle}
                  label={
                    <FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />
                  }
                >
                  <AggregatorConfigForm
                    fields={aggregatorConfigFields}
                    onAddField={this.handleAddConfigField}
                    onChange={this.handleConfigChange}
                    onRemoveField={this.handleRemoveConfigField}
                    stripes={stripes}
                  />
                </Accordion>

                <Accordion
                  open={sections.accountConfig}
                  id="accountConfig-form"
                  onToggle={this.handleSectionToggle}
                  label={
                    <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />
                  }
                >
                  <Row>
                    <Col xs={8}>
                      <Field
                        label={
                          <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type" />
                        }
                        name="accountConfig.configType"
                        id="input-aggregator-account-type"
                        placeholder={intl.formatMessage({
                          id:
                            'ui-erm-usage.aggregator.form.placeholder.configType',
                        })}
                        component={Select}
                        dataOptions={aggregatorAccountConfigTypes}
                        fullWidth
                        disabled={disabled}
                        required
                        validate={[required]}
                      />
                      <Field
                        label={
                          <FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />
                        }
                        name="accountConfig.configMail"
                        id="input-aggregator-config-mail"
                        component={TextField}
                        fullWidth
                        disabled={disabled}
                        required={configTypeIsMail}
                        validate={configMailValidate}
                      />
                      <DisplayContactsForm {...this.props} />
                    </Col>
                  </Row>
                </Accordion>
              </AccordionSet>

              <ConfirmationModal
                id="deleteaggregator-confirmation"
                open={confirmDelete}
                heading={
                  <FormattedMessage id="ui-erm-usage.aggregator.form.delete.confirm.title" />
                }
                message={confirmationMessage}
                onConfirm={() => {
                  this.confirmDelete(true);
                }}
                onCancel={() => {
                  this.confirmDelete(false);
                }}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default injectIntl(
  stripesForm({
    form: 'aggreagtorForm',
    navigationCheck: true,
    enableReinitialize: true,
  })(AggregatorForm)
);
