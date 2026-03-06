import {
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Accordion,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import reportReleaseOptions from '../../util/data/reportReleaseOptions';
import { AggregatorInfoView } from './AggregatorInfo';
import { SushiCredentialsView } from './SushiCredentials';
import { VendorInfoView } from './VendorInfo';

const HarvestingConfigurationView = ({
  usageDataProvider,
  stripes,
  sushiCredsOpen,
  onToggle,
  settings,
  harvesterImpls,
}) => {
  const createProvider = (udp) => {
    const harvestVia = get(udp, 'harvestingConfig.harvestVia');

    if (!harvestVia) {
      return null;
    }

    if (harvestVia === 'aggregator') {
      return (
        <AggregatorInfoView
          stripes={stripes}
          usageDataProvider={udp}
        />
      );
    } else {
      return (
        <VendorInfoView
          harvesterImpls={harvesterImpls}
          usageDataProvider={udp}
        />
      );
    }
  };

  const provider = createProvider(usageDataProvider);
  const reports = get(usageDataProvider, 'harvestingConfig.requestedReports', []).sort();
  let requestedReports = '';

  if (!isEmpty(reports)) {
    requestedReports = reports.join(', ');
  }

  const counterVersion = get(usageDataProvider, 'harvestingConfig.reportRelease', '');
  const reportRelease = reportReleaseOptions.find(
    (e) => e.value === counterVersion
  );
  const reportReleaseLabel = reportRelease?.label ?? <NoValue />;

  const harvestingStart = usageDataProvider.harvestingConfig?.harvestingStart ?? <NoValue />;
  const harvestingEnd = usageDataProvider.harvestingConfig?.harvestingEnd ?? <NoValue />;

  return (
    <div>
      {provider}
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease" />}
            value={reportReleaseLabel}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />}
            value={requestedReports}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />}
            value={harvestingStart}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
            value={harvestingEnd}
          />
        </Col>
      </Row>
      <Accordion
        id="sushiCredsAccordion"
        label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.credentials" />}
        onToggle={onToggle}
        open={sushiCredsOpen}
      >
        <SushiCredentialsView
          settings={settings}
          usageDataProvider={usageDataProvider}
        />
      </Accordion>
    </div>
  );
};

HarvestingConfigurationView.propTypes = {
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
  onToggle: PropTypes.func,
  settings: PropTypes.arrayOf(PropTypes.object).isRequired,
  stripes: PropTypes.object.isRequired,
  sushiCredsOpen: PropTypes.bool,
  usageDataProvider: PropTypes.object.isRequired,
};

export default injectIntl(HarvestingConfigurationView);
