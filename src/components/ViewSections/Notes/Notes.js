import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

class Notes extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    accordionId: PropTypes.string.isRequired,
    usageDataProvider: PropTypes.object.isRequired,
  };

  render() {
    const { usageDataProvider, expanded, accordionId, onToggle } = this.props;
    const rawNotes = _.get(usageDataProvider, 'notes', '');
    const n = rawNotes.split('\n').map((item, i) => <p key={i}>{item}</p>);

    return (
      <Accordion
        open={expanded}
        onToggle={onToggle}
        label="Notes"
        id={accordionId}
      >
        {
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
        }
      </Accordion>
    );
  }
}

export default Notes;
