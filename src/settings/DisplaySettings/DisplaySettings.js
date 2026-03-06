import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';
import { ConfigManager } from '@folio/stripes/smart-components';

import {
  FORM_TYPE_FINAL_FORM,
  MOD_SETTINGS,
} from '../../util/constants';

const { SCOPES, CONFIG_NAMES: { HIDE_CREDENTIALS } } = MOD_SETTINGS;

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
        configName={HIDE_CREDENTIALS}
        formType={FORM_TYPE_FINAL_FORM}
        label={label}
        scope={SCOPES.EUSAGE}
      >
        <Row>
          <Col xs={12}>
            <Field
              component={Checkbox}
              id={HIDE_CREDENTIALS}
              label={<FormattedMessage id="ui-erm-usage.settings.hideCredentials" />}
              name={HIDE_CREDENTIALS}
              type="checkbox"
            />
          </Col>
        </Row>
      </this.configManager>
    );
  }
}

export default DisplaySettings;
