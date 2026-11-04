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
  Headline,
  Loading,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import formCss from '../../util/sharedStyles/form.css';

const isEnabled = validator => (value, allValues) => (
  allValues.enablePeriodic ? validator(value) : undefined
);

const ErrorHandlingForm = ({
  handleSubmit,
  initialValues,
  intl,
  isLoading,
  pristine,
  submitting,
  values,
}) => {
    const renderPaneHeader = () => {
    return <PaneHeader paneTitle={<FormattedMessage id="ui-erm-usage.settings.errorHandling" />} />;
  };

  const renderPaneFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        id="clickable-save-error-handling"
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-erm-usage.general.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  const renderCounterApiExceptionsFields = () => (
    <form
      id="form-error-handling"
      onSubmit={handleSubmit}
    >
      <div className={formCss.paddingBottom}>
      </div>
    </form>
  );

  return (
    <Pane
      defaultWidth="fill"
      fluidContentWidth
      footer={renderPaneFooter()}
      id="errorHandling-pane"
      renderHeader={renderPaneHeader}
    >
      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <p><FormattedMessage id="ui-erm-usage.settings.errorHandling.helpText" /></p>
      </section>

      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <Headline margin="none" tag="h3"><FormattedMessage id="ui-erm-usage.settings.general" /></Headline>
      </section>

      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <Headline margin="none" tag="h3"><FormattedMessage id="ui-erm-usage.settings.errorHandling.counterApiExceptions" /></Headline>
        <p><FormattedMessage id="ui-erm-usage.settings.errorHandling.counterApiExceptions.helpText" /></p>
        {isLoading ? <Loading /> : renderCounterApiExceptionsFields()}
      </section>
    </Pane>
  );
};

ErrorHandlingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape(),
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  subscription: {
    values: true,
    pristine: true,
    submitting: true,
  },
})(injectIntl(ErrorHandlingForm));
