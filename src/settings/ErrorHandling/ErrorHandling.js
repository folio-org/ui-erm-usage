import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  InfoPopover,
  Row,
  TextField,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import {
  FORM_TYPE_FINAL_FORM,
  MAX_FAILED_ATTEMPTS,
  MOD_SETTINGS,
} from '../../util/constants';
import formCss from '../../util/sharedStyles/form.css';

const { SCOPES, CONFIG_NAMES } = MOD_SETTINGS;

const ErrorHandling = () => {
  const stripes = useStripes();
  const ConfigManagerConnected = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const getInitialValues = (settings) => (
    { [CONFIG_NAMES.MAX_FAILED_ATTEMPTS]: settings[0]?.value || MAX_FAILED_ATTEMPTS }
  );

  return (
    <ConfigManagerConnected
      configName={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
      formType={FORM_TYPE_FINAL_FORM}
      getInitialValues={getInitialValues}
      label={<FormattedMessage id="ui-erm-usage.settings.errorHandling" />}
      scope={SCOPES.HARVESTER}
    >
      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <p><FormattedMessage id="ui-erm-usage.settings.errorHandling.helpText" /></p>
      </section>

      <section className={`${formCss.separator} ${formCss.paddingBottom}`}>
        <Headline margin="none" tag="h3">
          <FormattedMessage id="ui-erm-usage.settings.errorHandling.general" />
        </Headline>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              id={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
              // label={<FormattedMessage id="ui-erm-usage.settings.errorHandling.NumberFailedAttempts" />}
              label={
                <>
                  <FormattedMessage id="ui-erm-usage.settings.errorHandling.NumFailedAttempts" />
                  <InfoPopover
                    content={<FormattedMessage id="ui-erm-usage.settings.errorHandling.NumFailedAttempts.helpText" />}
                  />
                </>
              }
              name={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
              type="number"
            />
          </Col>
        </Row>
      </section>

      <section>
        <Headline margin="none" tag="h3">
          <FormattedMessage id="ui-erm-usage.settings.errorHandling.counterApiExceptions" />
        </Headline>
        <p><FormattedMessage id="ui-erm-usage.settings.errorHandling.counterApiExceptions.helpText" /></p>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              id={CONFIG_NAMES.xxx}
              label={
                <>
                  <FormattedMessage id="ui-erm-usage.settings.errorHandling.counterApiExceptions.xxx" />
                  <InfoPopover
                    content={
                      <>xxx</>
                    }
                  />
                </>
              }
              name="xxx"
              type="xxx"
            />
          </Col>
        </Row>
      </section>
    </ConfigManagerConnected>
  );
};

ErrorHandling.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default ErrorHandling;
