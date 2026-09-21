import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import {
  formatUnsupportedLabel,
  isServiceTypeSupported,
} from '../../../util/harvesterImpls';
import AggregatorContactInfo from './AggregatorContactInfo';

const AggregatorInfoView = ({
  aggregatorImpls,
  aggregators,
  usageDataProvider,
  stripes,
}) => {
  const intl = useIntl();
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

  const aggregatorSettings = aggregators?.[0]?.aggregatorSettings ?? [];
  const aggregatorServiceType = aggregatorSettings.find(a => a.id === aggregatorId)?.serviceType;

  const aggregatorNameLabel = formatUnsupportedLabel(
    intl,
    aggregatorName,
    isServiceTypeSupported(aggregatorImpls, aggregatorServiceType)
  );

  const hasPermGeneralSettingsManage = stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const displayAggregationName = hasPermGeneralSettingsManage ?
    <Link to={`/settings/eusage/aggregators/${aggregatorId}`}>
      {aggregatorNameLabel}
    </Link> :
    <>{aggregatorNameLabel}</>;
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
          value={<FormattedMessage id="ui-erm-usage.information.aggregator" />}
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
          value={usageDataProvider.harvestingConfig?.aggregator?.vendorCode ?? <NoValue />}
        />
      </Col>
    </Row>
  );
};

AggregatorInfoView.propTypes = {
  aggregatorImpls: PropTypes.arrayOf(PropTypes.shape()),
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  usageDataProvider: PropTypes.object.isRequired,
};

export default AggregatorInfoView;
