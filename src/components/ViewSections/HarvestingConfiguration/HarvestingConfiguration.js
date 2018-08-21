import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import AggregatorInfo from '../AggregatorInfo';

class HarvestingConfiguration extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    accordionId: PropTypes.string.isRequired,
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.cAggregatorInfo = this.props.stripes.connect(AggregatorInfo);
  }

  createAggregatorView = udp => {
    const aggregatorId = _.get(udp, 'aggregator.id', '');
    const aggregatorInfo = this.renderAggregatorInfo(aggregatorId);

    return (
      <Row>
        <Col xs={3}>
          <KeyValue
            label="Aggregator"
            value="Yes"
          />
        </Col>
        <Col xs={3}>
          <KeyValue label="Aggregator" value={aggregatorInfo} />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Vendor code"
            value={_.get(udp, 'aggregator.vendorCode', '')}
          />
        </Col>
      </Row>);
  }

  renderAggregatorInfo = (aggregatorId) => {
    return (
      <div>
        <this.cAggregatorInfo stripes={this.props.stripes} aggregatorId={aggregatorId} />
      </div>);
  }

  createVendorView = udp => {
    return (
      <Row>
        <Col xs={3}>
          <KeyValue
            label="Aggregator"
            value="No"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Service Type"
            value={_.get(udp, 'serviceType', '')}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Service Url"
            value={_.get(udp, 'serviceUrl', '')}
          />
        </Col>
      </Row>);
  }

  createProvider = udp => {
    const isAggregator = _.has(udp, 'aggregator');
    if (isAggregator) {
      return this.createAggregatorView(udp);
    } else {
      return this.createVendorView(udp);
    }
  }

  render() {
    const { usageDataProvider, expanded, accordionId, onToggle } = this.props;

    const provider = this.createProvider(usageDataProvider);

    const reports = _.get(usageDataProvider, 'requestedReports', '');
    let requestedReports = '';
    if (!_.isEmpty(reports)) {
      requestedReports = reports.join(', ');
    }

    const counterVersion = _.get(usageDataProvider, 'reportRelease', '');
    const reportRelease = counterVersion === 4 ? 'Counter 4' : 'Counter 5';

    return (
      <Accordion
        open={expanded}
        onToggle={onToggle}
        label="Harvesting configuration"
        id={accordionId}
      >
        {
          <div>
            <Row>
              <Col xs={3}>
                <KeyValue
                  label="Harvesting status"
                  value={_.get(usageDataProvider, 'harvestingStatus', '')}
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
            </Row>
          </div>
        }
      </Accordion>
    );
  }
}

export default HarvestingConfiguration;
