import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col, KeyValue, NoValue } from '@folio/stripes/components';
import AggregatorContactInfo from './AggregatorContactInfo';

const AggregatorInfoView = ({ usageDataProvider, stripes }) => {
  const aggregatorId = _.get(
    usageDataProvider,
    'harvestingConfig.aggregator.id',
    ''
  );
  const aggregatorName = _.get(
    usageDataProvider,
    'harvestingConfig.aggregator.name',
    ''
  );

  const hasPermGeneralSettingsManage = stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const displayAggregationName = hasPermGeneralSettingsManage ?
    <Link to={`/settings/eusage/aggregators/${aggregatorId}`}>
      {aggregatorName}
    </Link> :
    <React.Fragment>
      {aggregatorName}
    </React.Fragment>;
  const aggregatorContact = (
    <AggregatorContactInfo aggregatorId={aggregatorId} stripes={stripes} />
  );
  const aggregatorLink = aggregatorId ?
    (
      <React.Fragment>
        {displayAggregationName}
        {aggregatorContact}
      </React.Fragment>
    ) : (
      <NoValue />
    );

  return (
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-erm-usage.information.harvestVia" />}
          value="Aggregator"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={
            <FormattedMessage id="ui-erm-usage.aggregatorInfo.aggregatorName" />
          }
          value={aggregatorLink}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={
            <FormattedMessage id="ui-erm-usage.aggregatorInfo.vendorCode" />
          }
          value={
            usageDataProvider.harvestingConfig?.aggregator?.vendorCode ?? (
              <NoValue />
            )
          }
        />
      </Col>
    </Row>
  );
};

AggregatorInfoView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default AggregatorInfoView;
