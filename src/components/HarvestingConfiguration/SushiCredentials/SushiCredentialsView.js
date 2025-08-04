import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

const SushiCredentialsView = ({
  usageDataProvider,
  settings,
}) => {
  const hideCredentials = settings[0]?.value === true;

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
            label={<FormattedMessage id="ui-erm-usage.credentials.customerId" />}
            value={customerId}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.credentials.requestorId" />}
            value={requestorId}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.credentials.apiKey" />}
            value={apiKey}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.credentials.platform" />}
            value={usageDataProvider.sushiCredentials?.platform ?? <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.credentials.requestorName" />}
            value={usageDataProvider.sushiCredentials?.requestorName ?? <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.credentials.requestorMail" />}
            value={usageDataProvider.sushiCredentials?.requestorMail ?? <NoValue />}
          />
        </Col>
      </Row>
    </div>
  );
};

SushiCredentialsView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  settings: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SushiCredentialsView;
