import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Link
} from 'react-router-dom';
import {
  Row,
  Col,
  KeyValue
} from '@folio/stripes/components';
import AggregatorContactInfo from './AggregatorContactInfo';

const AggregatorInfoView = ({ usageDataProvider, stripes }) => {
  const aggregatorId = _.get(usageDataProvider, 'harvestingConfig.aggregator.id', '');
  const aggregatorName = _.get(usageDataProvider, 'harvestingConfig.aggregator.name', '');

  const aggregatorContact = (
    <AggregatorContactInfo
      aggregatorId={aggregatorId}
      stripes={stripes}
    />
  );
  const aggregatorLink = (
    <React.Fragment>
      <Link to={`/settings/eusage/aggregators/${aggregatorId}`}>
        {aggregatorName}
      </Link>
      {aggregatorContact}
    </React.Fragment>
  );

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.harvestVia" />}
          value="Aggregator"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.aggregatorName" />}
          value={aggregatorLink}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.aggregatorInfo.vendorCode" />}
          value={_.get(usageDataProvider, 'harvestingConfig.aggregator.vendorCode', '-')}
        />
      </Col>
    </Row>);
};

AggregatorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes.shape().isRequired,
};

export default AggregatorInfoView;
