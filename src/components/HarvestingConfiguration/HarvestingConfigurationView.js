import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment-timezone';
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
import harvestingStatusOptions from '../../util/data/harvestingStatusOptions';
import reportReleaseOptions from '../../util/data/reportReleaseOptions';

class HarvestingConfigurationView extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    sushiCredsOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
    harvesterImpls: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    this.timeZone = props.intl.timeZone;
  }

  createProvider = (udp) => {
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
          harvesterImpls={this.props.harvesterImpls}
        />
      );
    }
  };

  renderLastHarvestingDate = (udp) => {
    if (_.isNil(udp.harvestingDate)) {
      return <NoValue />;
    }
    const date = moment(udp.harvestingDate).local();
    return date.format('MMM DD YYYY, HH:mm:ss');
  };

  render() {
    const { usageDataProvider, onToggle, sushiCredsOpen } = this.props;

    const provider = this.createProvider(usageDataProvider);

    const reports = _.get(
      usageDataProvider,
      'harvestingConfig.requestedReports',
      []
    ).sort();
    let requestedReports = '';
    if (!_.isEmpty(reports)) {
      requestedReports = reports.join(', ');
    }

    const hStatus = _.get(
      usageDataProvider,
      'harvestingConfig.harvestingStatus',
      ''
    );
    const harvestingStatus = harvestingStatusOptions.find(
      (e) => e.value === hStatus
    );
    const harvestingStatusLabel = harvestingStatus.label ?? <NoValue />;

    const counterVersion = _.get(
      usageDataProvider,
      'harvestingConfig.reportRelease',
      ''
    );
    const reportRelease = reportReleaseOptions.find(
      (e) => e.value === counterVersion
    );
    const reportReleaseLabel = reportRelease.label ?? <NoValue />;

    const harvestingStart = usageDataProvider.harvestingConfig
      ?.harvestingStart ?? <NoValue />;
    const harvestingEnd = usageDataProvider.harvestingConfig?.harvestingEnd ?? (
      <NoValue />
    );

    const lastHarvesting = this.renderLastHarvestingDate(usageDataProvider);

    return (
      <div>
        <Row>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />
              }
              value={harvestingStatusLabel}
            />
          </Col>
          <Col xs={3}>
            <></>
          </Col>
          <Col xs={3}>
            <></>
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.lastHarvesting" />
              }
              value={<div data-test-last-harvesting>{lastHarvesting}</div>}
            />
          </Col>
        </Row>
        {provider}
        <Row>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease" />
              }
              value={reportReleaseLabel}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
              }
              value={requestedReports}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />
              }
              value={harvestingStart}
            />
          </Col>
          <Col xs={3}>
            <KeyValue
              label={
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />
              }
              value={harvestingEnd}
            />
          </Col>
        </Row>
        <Accordion
          open={sushiCredsOpen}
          onToggle={onToggle}
          label={
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.sushiCredentials" />
          }
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

export default injectIntl(HarvestingConfigurationView);
