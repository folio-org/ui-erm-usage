import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
              label="Customer ID"
              value={_.get(usageDataProvider, 'customerId', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="Requestor ID"
              value={_.get(usageDataProvider, 'requestorId', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="API key"
              value={_.get(usageDataProvider, 'apiKey', '-')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <KeyValue
              label="Requestor name"
              value={_.get(usageDataProvider, 'requestorName', '-')}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="Requestor mail"
              value={_.get(usageDataProvider, 'requestorMail', '-')}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SushiCredentialsView;
