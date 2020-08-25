import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

class SushiCredentialsView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { usageDataProvider, settings } = this.props;

    const hideCredentials = settings.length && settings[0].value === 'true';

    const cId = usageDataProvider.sushiCredentials?.customerId ?? <NoValue />;
    const customerId = hideCredentials ? '*'.repeat(cId.length) : cId;

    const rId = usageDataProvider.sushiCredentials?.requestorId ?? <NoValue />;
    const requestorId = hideCredentials ? '*'.repeat(rId.length) : rId;

    const key = usageDataProvider.sushiCredentials?.apiKey ?? <NoValue />;
    const apiKey = hideCredentials ? '*'.repeat(key.length) : key;

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.sushiCreds.customerId" />
              }
              value={customerId}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.sushiCreds.requestorId" />
              }
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
              label={
                <FormattedMessage id="ui-erm-usage.sushiCreds.requestorName" />
              }
              value={
                usageDataProvider.sushiCredentials?.requestorName ?? <NoValue />
              }
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.sushiCreds.requestorMail" />
              }
              value={
                usageDataProvider.sushiCredentials?.requestorMail ?? <NoValue />
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SushiCredentialsView;
