import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  InfoPopover,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

class AggregatorConfigForm extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onAddField: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemoveField: PropTypes.func.isRequired,
  }

  render() {
    const { fields, onAddField, onChange, onRemoveField } = this.props;

    return (
      <React.Fragment>
        <InfoPopover
          content="For German National Statistic Server specify the keys: apiKey, requestorId, customerId, reportRelease"
        />
        <RepeatableField
          addLabel="Add config parameter"
          fields={fields}
          onAdd={onAddField}
          onRemove={onRemoveField}
          renderField={(field, index) => (
            <Row>
              <Col xs={6} sm={4}>
                <TextField
                  autoFocus
                  label="Key"
                  name={`agg[${index}].key`}
                  id={`aggregator-conf-input-key-${index}`}
                  onChange={(e) => onChange('key', index, e)}
                  value={field.key}
                  disabled={field.isInitial}
                />
              </Col>
              <Col xs={6} sm={4}>
                <TextField
                  label="Value"
                  name={`agg[${index}].value`}
                  id={`aggregator-conf-input-value-${index}`}
                  onChange={(e) => onChange('value', index, e)}
                  value={field.value}
                />
              </Col>
            </Row>
          )}
        />
      </React.Fragment>
    );
  }
}

export default AggregatorConfigForm;
