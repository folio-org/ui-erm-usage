import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';
import { required } from '../../../util/validate';

import harvestingStatusOptions from '../../../util/data/harvestingStatusOptions';
import useTranslateLabels from '../../../util/hooks/useTranslateLabels';

const HarvestingStatusSelect = () => {
  return (
    <Field
      label={
        <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />
      }
      name="harvestingConfig.harvestingStatus"
      id="addudp_harvestingstatus"
      placeholder="Select a harvesting status"
      component={Select}
      dataOptions={useTranslateLabels(harvestingStatusOptions)}
      required
      validate={required}
      fullWidth
    />
  );
};

export default HarvestingStatusSelect;
