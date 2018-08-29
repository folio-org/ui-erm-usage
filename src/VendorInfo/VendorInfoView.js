import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

const VendorInfoView = ({ usageDataProvider }) => {
  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label="Is aggregator?"
          value="No"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label="Service Type"
          value={_.get(usageDataProvider, 'serviceType', '')}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label="Service Url"
          value={_.get(usageDataProvider, 'serviceUrl', '')}
        />
      </Col>
    </Row>);
};

VendorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
};

export default VendorInfoView;
