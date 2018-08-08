import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';

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

  render() {
    const aggregator = this.props.initialValues;
    const { sections } = this.state;

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
          label="General Information"
        >
          {/* {servicePoint.metadata && servicePoint.metadata.createdDate &&
            <Row>
              <Col xs={12}>
                <this.cViewMetaData metadata={servicePoint.metadata} />
              </Col>
            </Row>
          } */}
          <Row>
            <Col xs={4}>
              <KeyValue label="Name" value={aggregator.label} />
              <KeyValue label="Service URL" value={aggregator.serviceUrl} />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue label="Username" value={aggregator.username} />
              <KeyValue label="Password" value={aggregator.password} />
              <KeyValue label="API Key" value={aggregator.apiKey} />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.accountConfig}
          id="accountConfig"
          onToggle={this.handleSectionToggle}
          label="Account Configuration"
        >
          <Row>
            <Col xs={4}>
              <KeyValue label="Type" value={aggregator.accountConfig.configType} />
              <KeyValue label="Mail" value={aggregator.accountConfig.configMail} />
              <KeyValue label="Contact" value={aggregator.accountConfig.displayContact} />
            </Col>
          </Row>
        </Accordion>
      </div>
    );
  }
}

export default AggregatorDetails;
