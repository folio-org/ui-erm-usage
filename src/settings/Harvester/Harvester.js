import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Col,
  Pane,
  Row,
  TextField
} from '@folio/stripes/components';
import { Field } from 'redux-form';
import { ConfigManager } from '@folio/stripes/smart-components';
import StartHavester from './StartHarvester';
import { MAX_FAILED_ATTEMPTS } from '../../util/constants';

class Harvester extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.cStartHarvester = this.props.stripes.connect(StartHavester);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  renderNotPresent = () => {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Required interface not present">
        <div>
          The interface usage-harvester is needed to start the harvester, but it is not present.
        </div>
      </Pane>
    );
  }

  renderStartButton() {
    if (this.props.stripes.hasInterface('erm-usage-harvester')) {
      return <this.cStartHarvester {...this.props} />;
    } else {
      return this.renderNotPresent();
    }
  }

  getInitialValues = (settings) => {
    let loadedValues = {};
    let value;
    try {
      value = settings.length === 0 ? MAX_FAILED_ATTEMPTS : settings[0].value;
      loadedValues = {
        maxFailedAttempts: value
      };
    } catch (e) {} // eslint-disable-line no-empty
    return loadedValues;
  }

  render() {
    return (
      <div data-test-settings-harvester-config>
        <this.configManager
          getInitialValues={this.getInitialValues}
          label={<FormattedMessage id="ui-erm-usage.settings.harvester.config" />}
          moduleName="ERM-USAGE-HARVESTER"
          configName="maxFailedAttempts"
        >
          <Row>
            <Col xs={12}>
              <Field
                component={TextField}
                type="number"
                id="maxFailedAttempts"
                name="maxFailedAttempts"
                label="Number failed attempts"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              { this.renderStartButton() }
            </Col>
          </Row>
        </this.configManager>
      </div>
    );
  }
}

export default Harvester;
