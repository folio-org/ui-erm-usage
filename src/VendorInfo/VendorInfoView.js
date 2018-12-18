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

const VendorInfoView = ({ usageDataProvider }) => {
  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.harvestVia" />}
          value="Sushi"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceType" />}
          value={_.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '-')}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
          value={_.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceUrl', '-')}
        />
      </Col>
    </Row>);
};

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
};

export default VendorInfoView;
