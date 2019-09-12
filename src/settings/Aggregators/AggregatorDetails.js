import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Accordion,
  Col,
  ExpandAllButton,
  KeyValue,
  Row
} from '@folio/stripes/components';

import DownloadCredentialsButton from './DownloadCredentialsButton';
import { AggregatorConfigView } from './AggregatorConfig';

import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

class AggregatorDetails extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==ERM-USAGE and configName==hide_credentials)',
    },
  });

  static propTypes = {
    initialValues: PropTypes.object,
    resources: PropTypes.shape({
      settings: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    stripes: PropTypes.shape().isRequired,
    aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.state = {
      sections: {
        generalInformation: true,
        accountConfig: true,
      },
    };

    this.connectedDownloadCredsButton = this.props.stripes.connect(DownloadCredentialsButton);
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  renderContact = (aggregator) => {
    if (aggregator.accountConfig && aggregator.accountConfig.displayContact) {
      return aggregator.accountConfig.displayContact.map((item, i) => <p key={i}>{item}</p>);
    } else {
      return null;
    }
  }

  render() {
    const { initialValues, aggregators } = this.props;
    const aggregator = initialValues;
    const { sections } = this.state;

    const contacts = this.renderContact(aggregator);

    const sType = _.get(aggregator, 'serviceType', '-');
    const serviceType = aggregators.find(e => e.value === sType);
    const serviceTypeLabel = serviceType ? serviceType.label : '-';

    const currentConfTypeValue = _.get(aggregator, 'accountConfig.configType', '');
    const configType = aggregatorAccountConfigTypes.find(e => e.value === currentConfTypeValue);
    const configTypeLabel = configType ? configType.label : '-';

    const settings = (this.props.resources.settings || {}).records || [];
    const hideValues = (!_.isEmpty(settings) && settings[0].value === 'true');

    const config = aggregator.aggregatorConfig;

    const displayWhenOpenAccountConfAcc = (
      <this.connectedDownloadCredsButton
        aggregatorId={aggregator.id}
        stripes={this.props.stripes}
      />
    );

    return (
      <div data-test-aggregator-details>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />}
        >
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.name" />} value={aggregator.label} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.serviceType" />} value={serviceTypeLabel} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />} value={aggregator.serviceUrl} />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.aggregatorConfig}
          id="aggregatorConfig"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />}
        >
          <Row>
            <Col xs={8}>
              <AggregatorConfigView
                aggregatorConfig={config}
                hideValues={hideValues}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.accountConfig}
          id="accountConfig"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
          displayWhenOpen={displayWhenOpenAccountConfAcc}
        >
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type" />} value={configTypeLabel} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />} value={aggregator.accountConfig.configMail} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.contact" />} value={contacts} />
            </Col>
          </Row>
        </Accordion>
      </div>
    );
  }
}

export default AggregatorDetails;
