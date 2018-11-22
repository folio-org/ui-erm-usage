import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';
import ContentVendorInfo from './ContentVendorInfo';

class UDPInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
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
    const { usageDataProvider, id } = this.props;
    const vendorInfo = usageDataProvider ? this.renderVendorInfo(usageDataProvider) : null;

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <Col xs={3}>
              <KeyValue label="Content vendor" value={vendorInfo} />
            </Col>
            <Col xs={3}>
              <KeyValue label="Content platform" value={_.get(usageDataProvider, 'platformId', '-')} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default UDPInfoView;
