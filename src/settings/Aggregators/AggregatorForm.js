import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, isNil } from 'lodash';

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

import DisplayContactsForm from './DisplayContactsForm';
import { required, mail } from '../../util/validate';
import { AggregatorConfigForm } from './AggregatorConfig';
import css from './AggregatorForm.css';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

// Helper to combine multiple validators
const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const AggregatorForm = ({
  stripes,
  initialValues,
  intl,
  onSubmit,
  onCancel,
  onRemove,
  aggregators,
}) => {
  const [showDirtyModal, setShowDirtyModal] = useState(false);
  const aggregator = initialValues || {};

  // SAFE onCancel wrapper
  const callOnCancelSafely = () => {
    onCancel?.({
      preventDefault: () => {},
      stopPropagation: () => {},
    });
  };

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

  const hasConfigType = (values) => {
    return !isEmpty(values?.accountConfig?.configType);
  };

  const getSelectedConfigType = (values) => {
    if (hasConfigType(values)) {
      return values.accountConfig.configType;
    } else {
      return null;
    }
  };

  const handleCancel = (form) => {
    if (form.getState().pristine) {
      callOnCancelSafely();
    } else {
      setShowDirtyModal(true);
    }
  };

  const handleCloseWithoutSaving = () => {
    setShowDirtyModal(false);
    callOnCancelSafely();
  };

  const handleKeepEditing = () => {
    setShowDirtyModal(false);
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

  const getFirstMenu = (form) => {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={() => handleCancel(form)}
          icon="times"
          aria-label="Cancel"
        />
      </PaneMenu>
    );
  };

  const getLastMenu = () => {
    const edit = initialValues?.id;

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

  const handleRemoveConfigField = (index, form) => {
    const currentConf = aggregatorConfigFields[index];
    setAggregatorConfigFields((fields) => [
      ...fields.slice(0, index),
      ...fields.slice(index + 1),
    ]);

    if (currentConf.key) {
      form.change(`aggregatorConfig.${currentConf.key}`, undefined);
    }
  };

  const handleConfigFieldChange = (fieldName, index, value, fields) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [fieldName]: value };
    return newFields;
  };

  const handleConfigChange = (field, index, e, form) => {
    const val = e?.target?.value ?? '';
    setAggregatorConfigFields((prevFields) => {
      const newFields = handleConfigFieldChange(field, index, val, prevFields);
      return newFields;
    });

    const key = aggregatorConfigFields[index]?.key;
    if (key) {
      form.change(`aggregatorConfig.${key}`, val);
    }
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

  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const name = aggregator.label || '';

  const confirmationMessage = (
    <FormattedMessage
      id="ui-erm-usage.form.delete.confirm.message"
      values={{ name }}
    />
  );

  return (
    <Form
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      onSubmit={onSubmit}
      keepDirtyOnReinitialize
    >
      {({
        form,
        handleSubmit,
        pristine,
        submitting,
        values,
      }) => {
        const configType = getSelectedConfigType(values);
        const configTypeIsMail = configType === 'Mail';
        const configMailValidate = configTypeIsMail ? composeValidators(mail, required) : mail;

        const getPaneFooter = () => {
          const footerDisabled = pristine || submitting;

          return (
            <PaneFooter
              renderStart={
                <Button
                  marginBottom0
                  id="clickable-close-aggregator"
                  buttonStyle="default mega"
                  onClick={() => handleCancel(form)}
                >
                  <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
                </Button>
              }
              renderEnd={
                <Button
                  marginBottom0
                  id="clickable-save-aggregator"
                  buttonStyle="primary mega"
                  type="submit"
                  disabled={footerDisabled}
                >
                  <FormattedMessage id="stripes-components.saveAndClose" />
                </Button>
              }
            />
          );
        };

        return (
          <form
            id="form-aggregator-setting"
            className={css.AggregatorFormRoot}
            onSubmit={handleSubmit}
          >
            <Paneset isRoot>
              <Pane
                defaultWidth="100%"
                renderHeader={renderProps => (
                  <PaneHeader
                    {...renderProps}
                    firstMenu={getFirstMenu(form)}
                    lastMenu={getLastMenu()}
                    paneTitle={renderPaneTitle()}
                  />
                )}
                footer={getPaneFooter()}
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
                            validate={required}
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
                            validate={required}
                          />
                          <Field
                            label={<FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />}
                            name="serviceUrl"
                            id="input-aggregator-service-url"
                            component={TextField}
                            fullWidth
                            disabled={disabled}
                            required
                            validate={required}
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
                        onChange={(field, index, e) => handleConfigChange(field, index, e, form)}
                        onRemoveField={(index) => handleRemoveConfigField(index, form)}
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
                            validate={required}
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

            <ConfirmationModal
              heading={<FormattedMessage id="stripes-form.areYouSure" />}
              id="cancel-editing-confirmation"
              message={<FormattedMessage id="stripes-form.unsavedChanges" />}
              onConfirm={handleCloseWithoutSaving}
              onCancel={handleKeepEditing}
              open={showDirtyModal}
              confirmLabel={<FormattedMessage id="stripes-form.closeWithoutSaving" />}
              cancelLabel={<FormattedMessage id="stripes-form.keepEditing" />}
            />
          </form>
        );
      }}
    </Form>
  );
};

AggregatorForm.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
  }).isRequired,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default injectIntl(AggregatorForm);
