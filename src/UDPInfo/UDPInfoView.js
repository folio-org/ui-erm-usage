import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import ContentVendorInfo from './ContentVendorInfo';

class UDPInfoView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes
      .shape({
        connect: PropTypes.func.isRequired,
      })
      .isRequired,
  };

  constructor(props) {
    super(props);
    this.cVendorInfo = this.props.stripes.connect(ContentVendorInfo);
  }

  renderVendorInfo = (udp) => {
    if (udp.vendorId) {
      return (
        <div>
          <this.cVendorInfo stripes={this.props.stripes} vendorId={udp.vendorId} />
        </div>);
    } else {
      return (
        <div>No Vendor</div>
      );
    }
  }

  render() {
    const { usageDataProvider } = this.props;
    const vendorInfo = this.renderVendorInfo(usageDataProvider);

    return (
      <React.Fragment>
        <Row>
          <Col xs={3}>
            <KeyValue label="Content vendor" value={vendorInfo} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Content platform" value={_.get(usageDataProvider, 'platformId', '')} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default UDPInfoView;
