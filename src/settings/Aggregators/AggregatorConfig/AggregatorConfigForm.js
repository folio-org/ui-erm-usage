import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  Col,
  InfoPopover,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

function AggregatorConfigForm({ fields, onAddField, onChange, onRemoveField }) {
  const intl = useIntl();

  return (
    <React.Fragment>
      <InfoPopover
        content={`${intl.formatMessage({
          id: 'ui-erm-usage.aggregator.config.popover',
        })} apiKey, requestorId, customerId, reportRelease`}
      />
      <RepeatableField
        id="add-agg-config-param"
        addLabel={intl.formatMessage({
          id: 'ui-erm-usage.aggregator.config.addParam',
        })}
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

AggregatorConfigForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onAddField: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemoveField: PropTypes.func.isRequired,
};

export default AggregatorConfigForm;
