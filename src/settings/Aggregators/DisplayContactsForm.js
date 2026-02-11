import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field, useForm } from 'react-final-form';

import {
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

const DisplayContactsForm = ({ stripes }) => {
  const intl = useIntl();
  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');
  const form = useForm();

  return (
    <FieldArray name="accountConfig.displayContact">
      {({ fields }) => (
        <RepeatableField
          addLabel={intl.formatMessage({
            id: 'ui-erm-usage.aggregator.config.addContact',
          })}
          fields={fields.value || []}
          id="display_contacts"
          onAdd={() => fields.push('')}
          onRemove={(index) => {
            fields.remove(index);
            // Ensure that if the last item is removed, the field is set to an empty array instead of undefined
            setTimeout(() => {
              const currentValue = form.getState().values?.accountConfig?.displayContact;
              if (currentValue === undefined || (Array.isArray(currentValue) && currentValue.length === 0)) {
                form.change('accountConfig.displayContact', []);
              }
            }, 0);
          }}
          renderField={(field, index) => (
            <Row>
              <Col xs={8}>
                <Field
                  name={`accountConfig.displayContact[${index}]`}
                >
                  {({ input }) => (
                    <TextField
                      {...input}
                      label={intl.formatMessage(
                        { id: 'ui-erm-usage.aggregator.config.accountConfig.contact.number' },
                        { number: Number.parseInt(index + 1, 10) }
                      )}
                      id={`aggregator-conf-input-value-${index}`}
                      disabled={disabled}
                    />
                  )}
                </Field>
              </Col>
            </Row>
          )}
        />
      )}
    </FieldArray>
  );
};

DisplayContactsForm.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default DisplayContactsForm;
