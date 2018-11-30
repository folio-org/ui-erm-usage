import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import {
  Col,
  KeyValue,
  Row
} from '@folio/stripes/components';

class NotesView extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
  };

  render() {
    const { usageDataProvider } = this.props;
    const rawNotes = _.get(usageDataProvider, 'notes', '');
    const n = _.isEmpty(rawNotes) ? '-' : rawNotes.split('\n').map((item, i) => <p key={i}>{item}</p>);

    return (
      <div>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.udp.notes" />}
              value={n}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NotesView;
