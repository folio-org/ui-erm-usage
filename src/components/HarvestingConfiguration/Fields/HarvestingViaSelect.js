import React from 'react';
import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';

import { required, notRequired } from '../../../util/validate';
import harvestingViaOptions from '../../../util/data/harvestingViaOptions';

const HarvestingViaSelect = (props) => {
  return (
    <Field
      component={Select}
      dataOptions={harvestingViaOptions}
      defaultValue="sushi"
      fullWidth
      id="harvestingConfig.harvestVia"
      key={props.required ? 1 : 0}
      label={<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator" />}
      name="harvestingConfig.harvestVia"
      onChange={props.onChange}
      required={props.required}
      validate={props.required ? required : notRequired}
    />
  );
};

HarvestingViaSelect.propTypes = {
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default HarvestingViaSelect;
