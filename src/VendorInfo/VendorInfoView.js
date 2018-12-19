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
import serviceTypeOptions from '../Utils/Data/serviceTypeOptions';

const VendorInfoView = ({ usageDataProvider }) => {
  const currentSType = _.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
  const serviceType = serviceTypeOptions.find(e => e.value === currentSType);
  const serviceTypeLabel = serviceType ? serviceType.label : '-';

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
          value={serviceTypeLabel}
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
