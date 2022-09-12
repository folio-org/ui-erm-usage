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
      component={Select}
      dataOptions={useTranslateLabels(harvestingStatusOptions)}
      defaultValue="active"
      fullWidth
      id="addudp_harvestingstatus"
      label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />}
      name="harvestingConfig.harvestingStatus"
      required
      validate={required}
    />
  );
};

export default HarvestingStatusSelect;
