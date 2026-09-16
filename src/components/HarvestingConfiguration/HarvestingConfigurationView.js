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

import { COUNTER } from '../../util/constants';
import extractHarvesterImpls, { isServiceTypeSupported } from '../../util/harvesterImpls';
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
  const harvestVia = get(usageDataProvider, 'harvestingConfig.harvestVia');
  const serviceType = get(usageDataProvider, 'harvestingConfig.sushiConfig.serviceType');
  const serviceTypeSupported = isServiceTypeSupported(harvesterImpls, serviceType);

  const createProvider = () => {
    if (!harvestVia) {
      return null;
    }

    if (harvestVia === 'aggregator') {
      return (
        <AggregatorInfoView
          stripes={stripes}
          usageDataProvider={usageDataProvider}
        />
      );
    } else {
      return (
        <VendorInfoView
          harvesterImpls={extractHarvesterImpls(harvesterImpls)}
          isServiceTypeSupported={serviceTypeSupported}
          usageDataProvider={usageDataProvider}
        />
      );
    }
  };

  const provider = createProvider();
  const reports = get(usageDataProvider, 'harvestingConfig.requestedReports', []).sort();
  let requestedReports = '';

  if (!isEmpty(reports)) {
    requestedReports = reports.join(', ');
  }

  const counterVersion = get(usageDataProvider, 'harvestingConfig.reportRelease', '');
  let reportReleaseLabel = <NoValue />;

  if (!serviceTypeSupported) {
    reportReleaseLabel = (
      <FormattedMessage
        id="ui-erm-usage.udpHarvestingConfig.unsupportedValue"
        values={{ value: serviceType }}
      />
    );
  } else if (counterVersion) {
    reportReleaseLabel = `${COUNTER} ${counterVersion}`;
  }

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
