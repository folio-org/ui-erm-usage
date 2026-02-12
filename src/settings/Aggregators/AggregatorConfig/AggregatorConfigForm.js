import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field, useForm } from 'react-final-form';
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
  const form = useForm();

  return (
    <FieldArray name="aggregatorConfig">
      {({ fields }) => (
        <>
          <InfoPopover
            content={`${intl.formatMessage({
              id: 'ui-erm-usage.aggregator.config.popover',
            })} apiKey, requestorId, customerId, reportRelease`}
          />
          <Row>
            <Col xs={8}>
              <RepeatableField
                id="add-agg-config-param"
                addLabel={intl.formatMessage({
                  id: 'ui-erm-usage.aggregator.config.addParam',
                })}
                fields={fields.value || []}
                onAdd={() => fields.push({ key: '', value: '', isInitial: false })}
                onRemove={(index) => {
                  fields.remove(index);
                  setTimeout(() => {
                    const currentValue = form.getState().values?.aggregatorConfig;
                    if (currentValue === undefined || (Array.isArray(currentValue) && currentValue.length === 0)) {
                      form.change('aggregatorConfig', []);
                    }
                  }, 0);
                }}
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
                            label="Key"
                            id={`aggregator-conf-input-key-${index}`}
                            disabled={field.isInitial || disabled}
                            error={meta.touched ? meta.error : undefined}
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
                            label="Value"
                            id={`aggregator-conf-input-value-${index}`}
                            disabled={disabled}
                            error={meta.touched ? meta.error : undefined}
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
