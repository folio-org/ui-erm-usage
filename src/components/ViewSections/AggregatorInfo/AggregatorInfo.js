import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import AggregatorName from '../AggregatorName';

const AggregatorInfo = ({ usageDataProvider, stripes }) => {
  const aggregatorId = _.get(usageDataProvider, 'aggregator.id', '');
  const aggregatorInfo = (
    <AggregatorName
      aggregatorId={aggregatorId}
      stripes={stripes}
    />
  );

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label="Is aggregator?"
          value="Yes"
        />
      </Col>
      <Col xs={3}>
        <KeyValue label="Aggregator name" value={aggregatorInfo} />
      </Col>
      <Col xs={3}>
        <KeyValue
          label="Vendor code"
          value={_.get(usageDataProvider, 'aggregator.vendorCode', '')}
        />
      </Col>
    </Row>);
}

AggregatorInfo.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes.shape().isRequired,
};

export default AggregatorInfo;
