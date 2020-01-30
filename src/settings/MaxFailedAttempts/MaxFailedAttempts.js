import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Col, Pane, Row, TextField } from '@folio/stripes/components';
import { Field } from 'redux-form';
import { ConfigManager } from '@folio/stripes/smart-components';
import { MAX_FAILED_ATTEMPTS } from '../../util/constants';

class MaxFailedAttempts extends React.Component {
  static propTypes = {
    stripes: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  renderNotPresent = () => {
    return (
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle="Required interface not present"
      >
        <div>
          The interface usage-harvester is needed to start the harvester, but it
          is not present.
        </div>
      </Pane>
    );
  };

  getInitialValues = settings => {
    let loadedValues = {};
    let value;
    try {
      value = settings.length === 0 ? MAX_FAILED_ATTEMPTS : settings[0].value;
      loadedValues = {
        maxFailedAttempts: value
      };
    } catch (e) {} // eslint-disable-line no-empty
    return loadedValues;
  };

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
          moduleName="ERM-USAGE-HARVESTER"
          configName="maxFailedAttempts"
        >
          <div data-test-settings-harvester-config>
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  type="number"
                  id="maxFailedAttempts"
                  name="maxFailedAttempts"
                  label="Number failed attempts"
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
