import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

class Notes extends React.Component {
  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
  };

  render() {
    const { usageDataProvider } = this.props;
    const rawNotes = _.get(usageDataProvider, 'notes', '');
    const n = rawNotes.split('\n').map((item, i) => <p key={i}>{item}</p>);

    return (
      <div>
        <Row>
          <Col xs={12}>
            <KeyValue
              label="Notes"
              value={n}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Notes;
