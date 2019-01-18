import React from 'react';
import {
  Field,
} from 'redux-form';
import {
  FormattedMessage
} from 'react-intl';
import {
  Select
} from '@folio/stripes/components';

import harvestingViaOptions from '../../../util/data/harvestingViaOptions';

const HarvestingViaSelect = () => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    }
    name="harvestingConfig.harvestVia"
    id="harvestingConfig.harvestVia"
    placeholder="Select how to harvest statistics"
    component={Select}
    dataOptions={harvestingViaOptions}
    fullWidth
  />
);

export default HarvestingViaSelect;
