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

class VendorInfoView extends React.Component {
  render() {
    const { usageDataProvider, harvesterImpls } = this.props;

    const currentSType = _.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
    const serviceType = harvesterImpls ? harvesterImpls.find(e => e.value === currentSType) : [];
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
            value={<div data-test-service-type>{serviceTypeLabel}</div>}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.vendorInfo.serviceUrl" />}
            value={_.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceUrl', '-')}
          />
        </Col>
      </Row>);
  }
}

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
};

export default VendorInfoView;
