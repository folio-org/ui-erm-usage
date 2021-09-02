import React from 'react';
import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@folio/stripes/components';
import { composeValidators, required, yearMonth } from '../../../util/validate';

const HarvestingStartField = (props) => {
  return (
    <Field
      label={
        <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />
      }
      name="harvestingConfig.harvestingStart"
      id="input-harvestingStart"
      component={TextField}
      placeholder="YYYY-MM"
      validate={props.required ? composeValidators(required, yearMonth) : yearMonth}
      required={props.required}
      key={props.required ? 1 : 0}
      fullWidth
    />
  );
};

HarvestingStartField.propTypes = {
  required: PropTypes.bool
};

export default HarvestingStartField;
