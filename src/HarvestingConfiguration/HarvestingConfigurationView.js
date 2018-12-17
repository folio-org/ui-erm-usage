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
import { AggregatorInfoView } from '../AggregatorInfo';
import { VendorInfoView } from '../VendorInfo';
import { SushiCredentialsView } from '../SushiCredentials';

class HarvestingConfigurationView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    sushiCredsOpen: PropTypes.bool,
    onToggle: PropTypes.func,
  };

  createProvider = udp => {
    const isAggregator = _.get(udp, 'harvestingConfig.useAggregator');
    if (isAggregator) {
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

    const counterVersion = _.get(usageDataProvider, 'harvestingConfig.reportRelease', '');
    const reportRelease = `Counter ${counterVersion}`;
    const harvestingStart = _.get(usageDataProvider, 'harvestingConfig.harvestingStart', '-');
    const harvestingEnd = _.get(usageDataProvider, 'harvestingConfig.harvestingEnd', '-');

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />}
              value={_.get(usageDataProvider, 'harvestingConfig.harvestingStatus', '-')}
            />
          </Col>
        </Row>
        { provider }
        <Row>
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease" />}
              value={reportRelease}
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
          <SushiCredentialsView usageDataProvider={usageDataProvider} />
        </Accordion>
      </div>
    );
  }
}

export default HarvestingConfigurationView;
