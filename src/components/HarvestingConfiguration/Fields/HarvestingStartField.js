import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@folio/stripes/components';
import { composeValidators, required, yearMonth } from '../../../util/validate';

const HarvestingStartField = () => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />
    }
    name="harvestingConfig.harvestingStart"
    id="input-harvestingStart"
    component={TextField}
    placeholder="YYYY-MM"
    validate={composeValidators(required, yearMonth)}
    required
    fullWidth
  />
);

export default HarvestingStartField;
