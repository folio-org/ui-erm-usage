import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';

class SushiCredentialsView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { usageDataProvider, settings } = this.props;

    const hideCredentials = (settings.length && settings[0].value === 'true');

    const cId = _.get(usageDataProvider, 'sushiCredentials.customerId', '-');
    const customerId = hideCredentials ? '*'.repeat(cId.length) : cId;

    const rId = _.get(usageDataProvider, 'sushiCredentials.requestorId', '-');
    const requestorId = hideCredentials ? '*'.repeat(rId.length) : rId;

    const key = _.get(usageDataProvider, 'sushiCredentials.apiKey', '-');
    const apiKey = hideCredentials ? '*'.repeat(key.length) : key;

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.customerId" />}
              value={customerId}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorId" />}
              value={requestorId}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.apiKey" />}
              value={apiKey}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorName" />}
              value={_.get(usageDataProvider, 'sushiCredentials.requestorName', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorMail" />}
              value={_.get(usageDataProvider, 'sushiCredentials.requestorMail', '-')}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SushiCredentialsView;
