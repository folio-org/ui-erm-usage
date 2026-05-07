import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';

import {
  Col,
  InfoPopover,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../util/validate';

function AggregatorConfigForm({ stripes }) {
  const intl = useIntl();
  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');

  return (
    <FieldArray name="aggregatorConfig">
      {({ fields }) => (
        <>
          <InfoPopover
            content={`${intl.formatMessage({
              id: 'ui-erm-usage.aggregator.config.popover',
            })} apiKey, requestorId, customerId`}
          />
          <Row>
            <Col xs={8}>
              <RepeatableField
                addLabel={intl.formatMessage({
                  id: 'ui-erm-usage.aggregator.config.addParam',
                })}
                fields={fields.value || []}
                id="add-agg-config-param"
                onAdd={() => fields.push({ key: '', value: '', isInitial: false })}
                onRemove={(index) => fields.remove(index)}
                renderField={(field, index) => (
                  <Row>
                    <Col xs={6}>
                      <Field
                        name={`aggregatorConfig[${index}].key`}
                        validate={required}
                      >
                        {({ input, meta }) => (
                          <TextField
                            {...input}
                            autoFocus
                            disabled={field.isInitial || disabled}
                            error={meta.touched ? meta.error : undefined}
                            id={`aggregator-conf-input-key-${index}`}
                            label="Key"
                            required
                          />
                        )}
                      </Field>
                    </Col>
                    <Col xs={6}>
                      <Field
                        name={`aggregatorConfig[${index}].value`}
                        validate={required}
                      >
                        {({ input, meta }) => (
                          <TextField
                            {...input}
                            disabled={disabled}
                            error={meta.touched ? meta.error : undefined}
                            id={`aggregator-conf-input-value-${index}`}
                            label="Value"
                            required
                          />
                        )}
                      </Field>
                    </Col>
                  </Row>
                )}
              />
            </Col>
          </Row>
        </>
      )}
    </FieldArray>
  );
}

AggregatorConfigForm.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default AggregatorConfigForm;
