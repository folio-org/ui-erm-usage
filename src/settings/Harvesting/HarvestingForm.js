import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  Datepicker,
  Headline,
  KeyValue,
  Loading,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
  Select,
  Timepicker,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';
import { formatDateTime } from '../../util/dateTimeProcessing';
import formCss from '../../util/sharedStyles/form.css';
import {
  required,
  requiredValidDate,
} from '../../util/validate';

const isEnabled = validator => (value, allValues) => (
  allValues.enablePeriodic ? validator(value) : undefined
);

const HarvestingForm = ({
  handleSubmit,
  initialValues,
  intl,
  isLoading,
  onStartHarvester,
  pristine,
  submitting,
  values,
}) => {
  const lastTriggeredAt = formatDateTime(initialValues.lastTriggeredAt, intl.locale, intl.timeZone);
  const isDisabled = !values?.enablePeriodic;

  const renderPaneHeader = () => {
    return <PaneHeader paneTitle={<FormattedMessage id="ui-erm-usage.settings.harvesting" />} />;
  };

  const renderPaneFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        id="clickable-save-periodic-harvesting"
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-erm-usage.general.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  const renderPeriodicHarvestingFields = () => (
    <form
      id="form-periodic-harvesting"
      onSubmit={handleSubmit}
    >
      <div className={formCss.paddingBottom}>
        <Field
          component={Checkbox}
          label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.enable" />}
          name="enablePeriodic"
          type="checkbox"
        />
      </div>
      <Row>
        <Col xs={8}>
          <Field
            component={Datepicker}
            disabled={isDisabled}
            id="periodic-harvesting-start"
            label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.start.date" />}
            name="date"
            outputFormatter={({ value }) => value}
            validate={isEnabled(requiredValidDate)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={Timepicker}
            disabled={isDisabled}
            label={intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.time' })}
            name="time"
            outputFormatter={({ value }) => value}
            validate={isEnabled(required)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={Select}
            dataOptions={periodicHarvestingIntervals.map(({ label, value }) => ({
              label: intl.formatMessage({ id: label }),
              value,
            }))}
            disabled={isDisabled}
            fullWidth
            id="periodic-harvesting-interval"
            label={<FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.periodicInterval" />}
            name="periodicInterval"
            validate={isEnabled(required)}
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
    </form>
  );

  return (
    <Pane
      defaultWidth="fill"
      fluidContentWidth
      footer={renderPaneFooter()}
      id="harvesting-pane"
      renderHeader={renderPaneHeader}
    >
      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <p><FormattedMessage id="ui-erm-usage.settings.harvesting.helpText" /></p>
      </section>

      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <Headline margin="none" tag="h3"><FormattedMessage id="ui-erm-usage.harvester.start" /></Headline>
        <p><FormattedMessage id="ui-erm-usage.settings.harvester.start.helpText" /></p>
        <p><FormattedMessage id="ui-erm-usage.settings.harvester.start.tenant" /></p>
        <Button id="start-harvester" onClick={onStartHarvester}>
          <FormattedMessage id="ui-erm-usage.harvester.start" />
        </Button>
      </section>

      <section>
        <Headline margin="none" tag="h3">
          <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.title" />
        </Headline>
        <p><FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.helpText" /></p>
        {isLoading ? <Loading /> : renderPeriodicHarvestingFields()}
      </section>
    </Pane>
  );
};

HarvestingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape(),
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  onStartHarvester: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.shape({
    enablePeriodic: PropTypes.bool,
  }),
};

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  subscription: {
    values: true,
    pristine: true,
    submitting: true,
  },
})(injectIntl(HarvestingForm));
