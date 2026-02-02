import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
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
import stripesFinalForm from '@folio/stripes/final-form';

import DisplayContactsForm from './DisplayContactsForm';
import { required, mail } from '../../util/validate';
import { AggregatorConfigForm } from './AggregatorConfig';
import css from './AggregatorForm.css';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

const validateConfigMail = (value, allValues) => {
  const configType = allValues?.accountConfig?.configType;
  const configTypeIsMail = configType === 'Mail';

  if (configTypeIsMail && !value) {
    return required(value);
  }

  if (value) {
    return mail(value);
  }

  return undefined;
};

const AggregatorForm = ({
  stripes,
  initialValues,
  intl,
  invalid,
  handleSubmit,
  onCancel,
  onRemove,
  pristine,
  submitting,
  form,
  values,
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

  const hasConfigType = (val) => {
    return (
      !isEmpty(val) &&
      !isEmpty(val.accountConfig) &&
      !isEmpty(val.accountConfig.configType)
    );
  };

  const getSelectedConfigType = () => {
    if (hasConfigType(values)) {
      return values.accountConfig.configType;
    } else {
      return null;
    }
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

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
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

  const updateForm = () => {
    form.batch(() => {
      aggregatorConfigFields.forEach((entry) => {
        if (entry.key) {
          const k = `aggregatorConfig.${entry.key}`;
          form.change(k, entry.value);
        }
      });
    });
  };

  const handleConfigChange = (field, index, e) => {
    const val = e === undefined ? '' : e.target.value;
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

  const renderPaneHeader = () => (
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
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={getPaneFooter()}
          renderHeader={renderPaneHeader}
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
                      validate={validateConfigMail}
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
  }).isRequired,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  intl: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  values: PropTypes.object,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default injectIntl(
  stripesFinalForm({
    navigationCheck: true,
    enableReinitialize: true,
    subscription: {
      values: true,
      invalid: true,
    },
  })(AggregatorForm)
);
