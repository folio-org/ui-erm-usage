import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Select } from '@folio/stripes/components';

import { required } from '../../../util/validate';
import harvestingViaOptions from '../../../util/data/harvestingViaOptions';

const HarvestingViaSelect = () => {
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
      required
      validate={required}
    />
  );
};

export default HarvestingViaSelect;
