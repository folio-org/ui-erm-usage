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
import aggregatorServiceTypes from '../../util/data/aggregatorServiceTypes';
import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

class AggregatorDetails extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
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

    // this.cViewMetaData = props.stripes.connect(ViewMetaData);
    // this.cLocationList = props.stripes.connect(LocationList);
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
    const { initialValues } = this.props;
    const aggregator = initialValues;
    const { sections } = this.state;

    const contacts = this.renderContact(aggregator);

    const sType = _.get(aggregator, 'serviceType', '-');
    const serviceType = aggregatorServiceTypes.find(e => e.value === sType);
    const serviceTypeLabel = serviceType ? serviceType.label : '-';

    const currentConfTypeValue = _.get(aggregator, 'accountConfig.configType', '');
    const configType = aggregatorAccountConfigTypes.find(e => e.value === currentConfTypeValue);
    const configTypeLabel = configType ? configType.label : '-';

    return (
      <div>
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
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.apiKey" />} value={aggregator.aggregatorConfig.apiKey} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.requestorId" />} value={aggregator.aggregatorConfig.requestorId} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.customerId" />} value={aggregator.aggregatorConfig.customerId} />
              <KeyValue label={<FormattedMessage id="ui-erm-usage.aggregator.config.reportRelease" />} value={aggregator.aggregatorConfig.reportRelease} />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.accountConfig}
          id="accountConfig"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
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
