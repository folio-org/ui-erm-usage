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

function UDPInfoView(props) {
  const { usageDataProvider, id } = props;
  return (
    <div id={id}>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.general.description" />}
            value={_.get(usageDataProvider, 'description', '-')}
          />
        </Col>
      </Row>
    </div>
  );
}

UDPInfoView.propTypes = {
  id: PropTypes.string,
  usageDataProvider: PropTypes.object.isRequired,
  stripes: PropTypes
    .shape({
      connect: PropTypes.func.isRequired,
    })
    .isRequired,
};

export default UDPInfoView;
