import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import AggregatorContactInfo from './AggregatorContactInfo';

const AggregatorInfoView = ({ usageDataProvider, stripes }) => {
  const aggregatorId = get(
    usageDataProvider,
    'harvestingConfig.aggregator.id',
    ''
  );
  const aggregatorName = get(
    usageDataProvider,
    'harvestingConfig.aggregator.name',
    ''
  );

  const hasPermGeneralSettingsManage = stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const displayAggregationName = hasPermGeneralSettingsManage ?
    <Link to={`/settings/eusage/aggregators/${aggregatorId}`}>
      {aggregatorName}
    </Link> :
    <>
      {aggregatorName}
    </>;
  const aggregatorContact = (
    <AggregatorContactInfo aggregatorId={aggregatorId} stripes={stripes} />
  );
  const aggregatorLink = aggregatorId ?
    (
      <>
        {displayAggregationName}
        {aggregatorContact}
      </>
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
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  usageDataProvider: PropTypes.object.isRequired,
};

export default AggregatorInfoView;
