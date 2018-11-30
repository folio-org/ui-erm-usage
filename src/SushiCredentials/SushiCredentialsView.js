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
  };

  render() {
    const { usageDataProvider } = this.props;

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.customerId" />}
              value={_.get(usageDataProvider, 'customerId', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorId" />}
              value={_.get(usageDataProvider, 'requestorId', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.apiKey" />}
              value={_.get(usageDataProvider, 'apiKey', '-')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorName" />}
              value={_.get(usageDataProvider, 'requestorName', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.sushiCreds.requestorMail" />}
              value={_.get(usageDataProvider, 'requestorMail', '-')}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SushiCredentialsView;
