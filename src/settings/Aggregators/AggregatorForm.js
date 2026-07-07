import arrayMutators from 'final-form-arrays';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
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
import stripesFinalForm from '@folio/stripes/final-form';

import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';
import {
  mail,
  required,
} from '../../util/validate';
import { AggregatorConfigForm } from './AggregatorConfig';
import css from './AggregatorForm.css';
import DisplayContactsForm from './DisplayContactsForm';

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
  pristine,
  submitting,
  values,
  aggregators,
}) => {
  const [sections, setSections] = useState({
    generalSection: true,
    aggregatorConfig: true,
    accountConfig: true,
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

  const getFirstMenu = () => {
    return (
      <PaneMenu>
        <IconButton
          aria-label="Cancel"
          icon="times"
          id="clickable-close-service-point"
          onClick={onCancel}
        />
      </PaneMenu>
    );
  };

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-close-aggregator"
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        disabled={disabled}
        id="clickable-save-aggregator"
        marginBottom0
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderEnd={endButton} renderStart={startButton} />;
  };

  const handleSectionToggle = ({ id }) => {
    setSections((curState) => ({
      ...curState,
      [id]: !curState[id],
    }));
  };

  const handleExpandAll = (secs) => {
    setSections(secs);
  };

  const renderPaneTitle = () => {
    const agg = initialValues || {};

    if (agg.id) {
      return (
        <div>
          <Icon icon="edit" size="small" />
          <span>{`Edit: ${agg.label}`}</span>
        </div>
      );
    }

    return <FormattedMessage id="ui-erm-usage.aggregator.form.newAggregator" />;
  };

  const renderPaneHeader = () => (
    <PaneHeader
      firstMenu={getFirstMenu()}
      paneTitle={renderPaneTitle()}
    />
  );

  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');

  const configType = getSelectedConfigType();
  const configTypeIsMail = configType === 'Mail';

  return (
    <form
      className={css.AggregatorFormRoot}
      id="form-aggregator-setting"
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
                id="generalSection"
                label={<FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />}
                onToggle={handleSectionToggle}
                open={sections.generalSection}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      component={TextField}
                      disabled={disabled}
                      fullWidth
                      id="input-aggregator-label"
                      label={<FormattedMessage id="ui-erm-usage.aggregator.name" />}
                      name="label"
                      required
                      validate={required}
                    />
                    <Field
                      component={Select}
                      dataOptions={aggregators}
                      fullWidth
                      id="input-aggregator-service-type"
                      label={<FormattedMessage id="ui-erm-usage.aggregator.serviceType" />}
                      name="serviceType"
                      placeholder={intl.formatMessage({
                        id: 'ui-erm-usage.aggregator.form.placeholder.serviceType',
                      })}
                      required
                      validate={required}
                    />
                    <Field
                      component={TextField}
                      disabled={disabled}
                      fullWidth
                      id="input-aggregator-service-url"
                      label={<FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />}
                      name="serviceUrl"
                      parse={value => value?.trim()}
                      required
                      validate={required}
                    />
                  </Col>
                </Row>
              </Accordion>

              <Accordion
                id="aggregatorConfig"
                label={<FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />}
                onToggle={handleSectionToggle}
                open={sections.aggregatorConfig}
              >
                <AggregatorConfigForm stripes={stripes} />
              </Accordion>

              <Accordion
                id="accountConfig"
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
                onToggle={handleSectionToggle}
                open={sections.accountConfig}
              >
                <Row>
                  <Col xs={8}>
                    <Field
                      component={Select}
                      dataOptions={aggregatorAccountConfigTypes}
                      disabled={disabled}
                      fullWidth
                      id="input-aggregator-account-type"
                      label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type" />}
                      name="accountConfig.configType"
                      placeholder={intl.formatMessage({
                        id: 'ui-erm-usage.aggregator.form.placeholder.configType',
                      })}
                      required
                      validate={required}
                    />
                    <Field
                      component={TextField}
                      disabled={disabled}
                      fullWidth
                      id="input-aggregator-config-mail"
                      label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />}
                      name="accountConfig.configMail"
                      required={configTypeIsMail}
                      validate={validateConfigMail}
                    />
                    <DisplayContactsForm stripes={stripes} />
                  </Col>
                </Row>
              </Accordion>
            </AccordionSet>
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

AggregatorForm.propTypes = {
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
};

export default injectIntl(
  stripesFinalForm({
    navigationCheck: true,
    enableReinitialize: true,
    mutators: {
      ...arrayMutators,
    },
    subscription: {
      values: true,
      invalid: true,
      pristine: true,
      submitting: true,
    },
  })(AggregatorForm)
);
