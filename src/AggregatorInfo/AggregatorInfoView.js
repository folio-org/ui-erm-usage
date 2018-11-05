import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  KeyValue
} from '@folio/stripes/components';
import AggregatorName from '../AggregatorName';

const AggregatorInfoView = ({ usageDataProvider, stripes }) => {
  const aggregatorId = _.get(usageDataProvider, 'aggregator.id', '');
  const aggregatorInfo = (
    <AggregatorName
      aggregatorId={aggregatorId}
      stripes={stripes}
      asLink
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
          value={_.get(usageDataProvider, 'aggregator.vendorCode', '-')}
        />
      </Col>
    </Row>);
};

AggregatorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes.shape().isRequired,
};

export default AggregatorInfoView;
