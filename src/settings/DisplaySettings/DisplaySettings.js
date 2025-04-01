import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  Checkbox,
} from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';

import { MOD_SETTINGS } from '../../util/constants';

const { SCOPE, CONFIG_NAMES: { HIDE_CREDENTIALS } } = MOD_SETTINGS;

class DisplaySettings extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  render() {
    const { label } = this.props;
    return (
      <this.configManager
        label={label}
        scope={SCOPE}
        configName={HIDE_CREDENTIALS}
      >
        <Row>
          <Col xs={12}>
            <Field
              component={Checkbox}
              type="checkbox"
              id={HIDE_CREDENTIALS}
              name={HIDE_CREDENTIALS}
              label={<FormattedMessage id="ui-erm-usage.settings.hideCredentials" />}
            />
          </Col>
        </Row>
      </this.configManager>
    );
  }
}

export default DisplaySettings;
