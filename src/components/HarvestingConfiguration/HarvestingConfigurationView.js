import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';
import { AggregatorInfoView } from './AggregatorInfo';
import { VendorInfoView } from './VendorInfo';
import { SushiCredentialsView } from './SushiCredentials';
import harvestingStatusOptions from '../../util/data/harvestingStatusOptions';
import reportReleaseOptions from '../../util/data/reportReleaseOptions';

class HarvestingConfigurationView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    sushiCredsOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  createProvider = udp => {
    const harvestVia = _.get(udp, 'harvestingConfig.harvestVia');
    if (harvestVia === 'aggregator') {
      return (
        <AggregatorInfoView
          usageDataProvider={udp}
          stripes={this.props.stripes}
        />
      );
    } else {
      return (
        <VendorInfoView
          usageDataProvider={udp}
        />
      );
    }
  }

  render() {
    const { usageDataProvider, onToggle, sushiCredsOpen } = this.props;

    const provider = this.createProvider(usageDataProvider);

    const reports = _.get(usageDataProvider, 'harvestingConfig.requestedReports', '');
    let requestedReports = '';
    if (!_.isEmpty(reports)) {
      requestedReports = reports.join(', ');
    }

    const hStatus = _.get(usageDataProvider, 'harvestingConfig.harvestingStatus', '');
    const harvestingStatus = harvestingStatusOptions.find(e => e.value === hStatus);
    const harvestingStatusLabel = harvestingStatus ? harvestingStatus.label : '-';

    const counterVersion = _.get(usageDataProvider, 'harvestingConfig.reportRelease', '');
    const reportRelease = reportReleaseOptions.find(e => e.value === counterVersion);
    const reportReleaseLabel = reportRelease ? reportRelease.label : '-';

    const harvestingStart = _.get(usageDataProvider, 'harvestingConfig.harvestingStart', '-');
    const harvestingEnd = _.get(usageDataProvider, 'harvestingConfig.harvestingEnd', '-');

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />}
              value={harvestingStatusLabel}
            />
          </Col>
        </Row>
        { provider }
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
            settings={this.props.settings}
          />
        </Accordion>
      </div>
    );
  }
}

export default HarvestingConfigurationView;
