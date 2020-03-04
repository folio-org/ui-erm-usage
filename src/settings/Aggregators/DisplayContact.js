import React from 'react';
import PropTypes from 'prop-types';
import {
  Field
} from 'redux-form';
import {
  Row,
  Col,
  Button,
  TextField
} from '@folio/stripes/components';


class DisplayContact extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    stripes: PropTypes.shape({
      store: PropTypes.object
    }),
  };

  constructor(props) {
    super(props);
    this.renderSubContact = this.renderSubContact.bind(this);
  }

  renderSubContact = (elem, index, fields) => {
    return (
      <Row key={elem}>
        <Col xs={8}>
          <Field
            label={`Contact #${parseInt(index + 1, 10)}`}
            name={elem}
            id={elem}
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={4} style={{ 'textAlign': 'right', 'marginTop': '25px' }}>
          <Button onClick={() => fields.remove(index)} buttonStyle="danger">
            Remove
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { fields } = this.props;
    return (
      <Row>
        <Col xs={12}>
          {fields.map(this.renderSubContact)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button onClick={() => fields.push('')}>+ Add Contact</Button>
        </Col>
      </Row>
    );
  }
}

export default DisplayContact;
