import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { autofill, change, getFormValues, Field } from 'redux-form';
import { useState } from 'react';
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
  PaneHeader,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import DisplayContactsForm from './DisplayContactsForm';
import { required, mail } from '../../util/validate';
import { AggregatorConfigForm } from './AggregatorConfig';
import css from './AggregatorForm.css';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

const AggregatorForm = ({
  stripes,
  initialValues,
  invalid,
  intl,
  handleSubmit,
  onSave,
  onCancel,
  onRemove,
  pristine,
  submitting,
  aggregators,
}) => {
  const aggregator = initialValues || {};

  const parseInitialAggConfig = () => {
    const { aggregatorConfig } = aggregator;
    if (isNil(aggregatorConfig)) {
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

  const initialAggConfig = parseInitialAggConfig();

  const [aggregatorConfigFields, setAggregatorConfigFields] = useState(initialAggConfig);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sections, setSections] = useState({
    generalSection: true,
    accountConfig: true,
    aggregatorConfig: true,
  });

  const getCurrentValues = () => {
    const state = stripes.store.getState();
    return getFormValues('aggregatorForm')(state) || {};
  };

  const hasConfigType = (values) => {
    return (
      !isEmpty(values) &&
      !isEmpty(values.accountConfig) &&
      !isEmpty(values.accountConfig.configType)
    );
  };

  const getSelectedConfigType = () => {
    const currentVals = getCurrentValues();
    if (hasConfigType(currentVals)) {
      return currentVals.accountConfig.configType;
    } else {
      return null;
    }
  };

  const save = (data) => {
    onSave(data);
  };

  const beginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (confirmation) {
      onRemove(initialValues);
    } else {
      setConfirmDelete(false);
    }
  };

  const getFirstMenu = () => {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={onCancel}
          icon="times"
          aria-label="Cancel"
        />
      </PaneMenu>
    );
  };

  const getLastMenu = () => {
    const edit = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {edit && (
          <IfPermission perm="ui-erm-usage.generalSettings.manage">
            <Button
              id="clickable-delete-aggregator"
              buttonStyle="danger"
              onClick={beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="ui-erm-usage.general.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  };

  const getPaneFooter = () => {
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
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  };

  const handleSectionToggle = ({ id }) => {
    setSections((curState) => ({
      ...curState,
      [id]: !curState[id]
    }));
  };

  const handleExpandAll = (secs) => {
    setSections(secs);
  };

  const handleAddConfigField = () => {
    setAggregatorConfigFields((fields) => fields.concat({}));
  };

  const handleRemoveConfigField = (index) => {
    const currentConf = aggregatorConfigFields[index];
    setAggregatorConfigFields((fileds) => [
      ...fileds.slice(0, index),
      ...fileds.slice(index + 1),
    ]);

    stripes.store.dispatch(
      autofill(
        'aggregatorForm',
        `aggregatorConfig.${currentConf.key}`,
        undefined
      )
    );
  };

  const handleConfigFieldChange = (fieldName, index, value, fields) => {
    fields[index][fieldName] = value;
    return fields;
  };

  const changeFormValue = (key, value) => {
    stripes.store.dispatch(change('aggregatorForm', key, value));
  };

  const updateForm = () => {
    aggregatorConfigFields.forEach((entry) => {
      const k = `aggregatorConfig.${entry.key}`;
      changeFormValue(k, entry.value);
    });
  };

  const handleConfigChange = (field, index, e) => {
    const val = e === undefined ? 'e' : e.target.value;
    setAggregatorConfigFields((prevFields) => {
      const newFields = handleConfigFieldChange(field, index, val, prevFields);
      updateForm();
      return newFields;
    });
  };

  const renderPaneTitle = () => {
    const agg = initialValues || {};

    if (agg.id) {
      return (
        <div>
          <Icon size="small" icon="edit" />
          <span>{`Edit: ${agg.label}`}</span>
        </div>
      );
    }

    return <FormattedMessage id="ui-erm-usage.aggregator.form.newAggregator" />;
  };

  const renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={getFirstMenu()}
      lastMenu={getLastMenu()}
      paneTitle={renderPaneTitle()}
    />
  );

  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const name = aggregator.label || '';

  const configType = getSelectedConfigType();
  const configTypeIsMail = configType === 'Mail';

  const configMailValidate = configTypeIsMail ? [mail, required] : [mail];

  const confirmationMessage = (
    <FormattedMessage
      id="ui-erm-usage.form.delete.confirm.message"
      values={{ name }}
    />
  );

  return (
    <form
      id="form-aggregator-setting"
      className={css.AggregatorFormRoot}
      onSubmit={handleSubmit(save)}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={getPaneFooter()}
          renderHeader={renderFormPaneHeader}
        >
          <div className={css.AggregatorFormContent}>
            <AccordionSet id="aggregator-form-accordion-set">
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={handleExpandAll}
                  />
                </Col>
              </Row>
              <Accordion
                open={sections.generalSection}
                id="generalSection"
                onToggle={handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label={<FormattedMessage id="ui-erm-usage.aggregator.name" />}
                      name="label"
                      id="input-aggregator-label"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      required
                      validate={[required]}
                    />
                    <Field
                      label={<FormattedMessage id="ui-erm-usage.aggregator.serviceType" />}
                      name="serviceType"
                      id="input-aggregator-service-type"
                      placeholder={intl.formatMessage({
                        id: 'ui-erm-usage.aggregator.form.placeholder.serviceType',
                      })}
                      component={Select}
                      dataOptions={aggregators}
                      fullWidth
                      required
                      validate={[required]}
                    />
                    <Field
                      label={<FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />}
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
                onToggle={handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />}
              >
                <AggregatorConfigForm
                  fields={aggregatorConfigFields}
                  onAddField={handleAddConfigField}
                  onChange={handleConfigChange}
                  onRemoveField={handleRemoveConfigField}
                  stripes={stripes}
                />
              </Accordion>

              <Accordion
                open={sections.accountConfig}
                id="accountConfig-form"
                onToggle={handleSectionToggle}
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type" />}
                      name="accountConfig.configType"
                      id="input-aggregator-account-type"
                      placeholder={intl.formatMessage({
                        id: 'ui-erm-usage.aggregator.form.placeholder.configType',
                      })}
                      component={Select}
                      dataOptions={aggregatorAccountConfigTypes}
                      fullWidth
                      disabled={disabled}
                      required
                      validate={[required]}
                    />
                    <Field
                      label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />}
                      name="accountConfig.configMail"
                      id="input-aggregator-config-mail"
                      component={TextField}
                      fullWidth
                      disabled={disabled}
                      required={configTypeIsMail}
                      validate={configMailValidate}
                    />
                    <DisplayContactsForm />
                  </Col>
                </Row>
              </Accordion>
            </AccordionSet>

            <ConfirmationModal
              id="deleteaggregator-confirmation"
              open={confirmDelete}
              heading={<FormattedMessage id="ui-erm-usage.aggregator.form.delete.confirm.title" />}
              message={confirmationMessage}
              onConfirm={() => {
                doConfirmDelete(true);
              }}
              onCancel={() => {
                doConfirmDelete(false);
              }}
            />
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

AggregatorForm.propTypes = {
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

export default injectIntl(
  stripesForm({
    form: 'aggregatorForm',
    navigationCheck: true,
    enableReinitialize: true,
  })(AggregatorForm)
);
