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

import harvestingStatusOptions from '../../../util/data/harvestingStatusOptions';

const HarvestingStatusSelect = () => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    }
    name="harvestingConfig.harvestingStatus"
    id="addudp_harvestingstatus"
    placeholder="Select a harvesting status"
    component={Select}
    dataOptions={harvestingStatusOptions}
    fullWidth
  />
);

export default HarvestingStatusSelect;
