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
  static manifest = Object.freeze({
    harvesterImpls: {
      type: 'okapi',
      path: 'erm-usage-harvester/impl?aggregator=false'
    }
  });

  render() {
    const { usageDataProvider, resources } = this.props;
    const records = (resources.harvesterImpls || {}).records || [];
    const implementations = records.length
      ? records[0].implementations
      : [];

    const currentSType = _.get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType', '');
    const serviceType = implementations.find(e => e.type === currentSType);
    const serviceTypeLabel = serviceType ? serviceType.name : '-';

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
  }
}

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    harvesterImpls: PropTypes.shape(),
  }),
};

export default VendorInfoView;
