import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Col, Row, TextField } from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';

import {
  MAX_FAILED_ATTEMPTS,
  MOD_SETTINGS
} from '../../util/constants';

const { SCOPES, CONFIG_NAMES } = MOD_SETTINGS;

class MaxFailedAttempts extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  getInitialValues = (settings) => ({ [CONFIG_NAMES.MAX_FAILED_ATTEMPTS]: settings[0]?.value || MAX_FAILED_ATTEMPTS });

  render() {
    return (
      <div
        data-test-settings-harvester-max-failed-attempts
        style={{ flex: '0 0 50%', left: '0px' }}
      >
        <this.configManager
          getInitialValues={this.getInitialValues}
          label={
            <FormattedMessage id="ui-erm-usage.settings.harvester.config" />
          }
          scope={SCOPES.HARVESTER}
          configName={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
        >
          <div data-test-settings-harvester-config>
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  type="number"
                  id={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
                  name={CONFIG_NAMES.MAX_FAILED_ATTEMPTS}
                  label={
                    <FormattedMessage id="ui-erm-usage.settings.section.number.failed" />
                  }
                />
              </Col>
            </Row>
          </div>
        </this.configManager>
      </div>
    );
  }
}

export default MaxFailedAttempts;
