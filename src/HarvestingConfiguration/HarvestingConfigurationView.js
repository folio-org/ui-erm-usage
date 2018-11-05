import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';
import { AggregatorInfoView } from '../AggregatorInfo';
import { VendorInfoView } from '../VendorInfo';

class HarvestingConfigurationView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  createProvider = udp => {
    const isAggregator = _.has(udp, 'aggregator');
    if (isAggregator) {
      return (
        <AggregatorInfoView
          usageDataProvider={udp}
          stripes={this.props.stripes}
        />
      );
    } else {
      return (
        <VendorInfoView
          usageDataProvider={udp}
        />
      );
    }
  }

  render() {
    const { usageDataProvider } = this.props;

    const provider = this.createProvider(usageDataProvider);

    const reports = _.get(usageDataProvider, 'requestedReports', '');
    let requestedReports = '';
    if (!_.isEmpty(reports)) {
      requestedReports = reports.join(', ');
    }

    const counterVersion = _.get(usageDataProvider, 'reportRelease', '');
    const reportRelease = counterVersion === 4 ? 'Counter 4' : 'Counter 5';
    const harvestingStart = _.get(usageDataProvider, 'harvestingStart', '-');
    const harvestingEnd = _.get(usageDataProvider, 'harvestingEnd', '-');

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label="Harvesting status"
              value={_.get(usageDataProvider, 'harvestingStatus', '-')}
            />
          </Col>
        </Row>
        { provider }
        <Row>
          <Col xs={3}>
            <KeyValue
              label="Report release"
              value={reportRelease}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="Requested report"
              value={requestedReports}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="Harvesting Start"
              value={harvestingStart}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label="Harvesting End"
              value={harvestingEnd}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HarvestingConfigurationView;
