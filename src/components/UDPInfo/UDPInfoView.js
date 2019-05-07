import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';

class UDPInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    usageDataProvider: PropTypes.object.isRequired,
    stripes: PropTypes
      .shape({
        connect: PropTypes.func.isRequired,
      })
      .isRequired,
  };

  render() {
    const { usageDataProvider, id } = this.props;

    return (
      <React.Fragment>
        <div id={id}>
          <Row>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.udpInfo.contentOrganization" />}
                value={_.get(usageDataProvider, 'vendor.name', '-')}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.udpInfo.contentPlatform" />}
                value={_.get(usageDataProvider, 'platform.id', '-')}
              />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default UDPInfoView;
