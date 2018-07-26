import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

class HarvestingConfiguration extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    accordionId: PropTypes.string.isRequired,
    usageDataProvider: PropTypes.object.isRequired,
  };

  createAggregatorView = udp => {
    return (
      <Row>
        <Col xs={3}>
          <KeyValue
            label="Aggregator"
            value="Yes"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Aggregator name"
            value={_.get(udp, 'aggregator.id', 'N/A')}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Vendor code"
            value={_.get(udp, 'aggregator.vendorCode', 'N/A')}
          />
        </Col>
      </Row>);
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
            value={_.get(udp, 'serviceType', 'N/A')}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label="Service Url"
            value={_.get(udp, 'serviceUrl', 'N/A')}
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
                  value={_.get(usageDataProvider, 'harvestingStatus', 'N/A')}
                />
              </Col>
            </Row>
            { provider }
            <Row>
              <Col xs={3}>
                <KeyValue
                  label="Report release"
                  value={_.get(usageDataProvider, 'reportRelease', 'N/A')}
                />
              </Col>
              <Col xs={3}>
                <KeyValue
                  label="Requested report"
                  value={_.get(usageDataProvider, 'requestedReports', 'N/A')}
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
