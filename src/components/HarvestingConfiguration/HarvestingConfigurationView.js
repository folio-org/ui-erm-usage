import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { AggregatorInfoView } from './AggregatorInfo';
import { VendorInfoView } from './VendorInfo';
import { SushiCredentialsView } from './SushiCredentials';
import reportReleaseOptions from '../../util/data/reportReleaseOptions';

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
          usageDataProvider={udp}
          stripes={stripes}
        />
      );
    } else {
      return (
        <VendorInfoView
          usageDataProvider={udp}
          harvesterImpls={harvesterImpls}
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
        open={sushiCredsOpen}
        onToggle={onToggle}
        label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.sushiCredentials" />}
        id="sushiCredsAccordion"
      >
        <SushiCredentialsView
          usageDataProvider={usageDataProvider}
          settings={settings}
        />
      </Accordion>
    </div>
  );
};

HarvestingConfigurationView.propTypes = {
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  sushiCredsOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  settings: PropTypes.arrayOf(PropTypes.object).isRequired,
  harvesterImpls: PropTypes.arrayOf(PropTypes.object),
};

export default injectIntl(HarvestingConfigurationView);
