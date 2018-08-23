import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

class SushiCredentials extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    accordionId: PropTypes.string.isRequired,
    usageDataProvider: PropTypes.object.isRequired,
  };

  render() {
    const { usageDataProvider, expanded, accordionId, onToggle } = this.props;

    return (
      <Accordion
        open={expanded}
        onToggle={onToggle}
        label="SUSHI credentials"
        id={accordionId}
      >
        {
          <div>
            <Row>
              <Col xs={3}>
                <KeyValue
                  label="Customer ID"
                  value={_.get(usageDataProvider, 'customerId', '')}
                />
              </Col>
              <Col xs={3}>
                <KeyValue
                  label="Requestor ID"
                  value={_.get(usageDataProvider, 'requestorId', '')}
                />
              </Col>
              <Col xs={3}>
                <KeyValue
                  label="API key"
                  value={_.get(usageDataProvider, 'apiKey', '')}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <KeyValue
                  label="Requestor name"
                  value={_.get(usageDataProvider, 'requestorName', '')}
                />
              </Col>
              <Col xs={3}>
                <KeyValue
                  label="Requestor mail"
                  value={_.get(usageDataProvider, 'requestorMail', '')}
                />
              </Col>
            </Row>
          </div>
        }
      </Accordion>
    );
  }
}

export default SushiCredentials;
