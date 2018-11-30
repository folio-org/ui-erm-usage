import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
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
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.isAggregator" />}
          value="Yes"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.aggregatorName" />}
          value={aggregatorInfo}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.vendorCode" />}
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
