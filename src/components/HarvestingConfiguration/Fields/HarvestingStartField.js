import React from 'react';
import {
  Field,
} from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  TextField
} from '@folio/stripes/components';
import {
  required,
  yearMonth
} from '../../../util/validate';

const HarvestingStartField = () => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    }
    name="harvestingConfig.harvestingStart"
    id="input-harvestingStart"
    component={TextField}
    placeholder="YYYY-MM"
    validate={[required, yearMonth]}
    fullWidth
  />
);

export default HarvestingStartField;
