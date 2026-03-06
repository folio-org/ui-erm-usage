import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';

import {
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

const DisplayContactsForm = ({ stripes }) => {
  const intl = useIntl();
  const disabled = !stripes.hasPerm('ui-erm-usage.generalSettings.manage');

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
          onRemove={(index) => fields.remove(index)}
          renderField={(field, index) => (
            <Row>
              <Col xs={10}>
                <Field
                  name={`accountConfig.displayContact[${index}]`}
                >
                  {({ input }) => (
                    <TextField
                      {...input}
                      disabled={disabled}
                      id={`aggregator-conf-input-value-${index}`}
                      label={intl.formatMessage(
                        { id: 'ui-erm-usage.aggregator.config.accountConfig.contact.number' },
                        { number: Number.parseInt(index + 1, 10) }
                      )}
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
