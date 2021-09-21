import React from 'react';
import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Select } from '@folio/stripes/components';

import { required, notRequired } from '../../../util/validate';
import harvestingViaOptions from '../../../util/data/harvestingViaOptions';

const HarvestingViaSelect = (props) => {
  const intl = useIntl();
  return (
    <Field
      label={
        <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator" />
      }
      name="harvestingConfig.harvestVia"
      id="harvestingConfig.harvestVia"
      placeholder={intl.formatMessage({
        id: 'ui-erm-usage.udp.form.placeholder.harvestingVia',
      })}
      component={Select}
      dataOptions={harvestingViaOptions}
      fullWidth
      required={props.required}
      validate={props.required ? required : notRequired}
      key={props.required ? 1 : 0}
      onChange={props.onChange}
    />
  );
};

HarvestingViaSelect.propTypes = {
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default HarvestingViaSelect;
