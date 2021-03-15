import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Select } from '@folio/stripes/components';
import { required } from '../../../util/validate';

import harvestingStatusOptions from '../../../util/data/harvestingStatusOptions';
import useTranslateLabels from '../../../util/hooks/useTranslateLabels';

const HarvestingStatusSelect = () => {
  const intl = useIntl();
  return (
    <Field
      label={
        <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />
      }
      name="harvestingConfig.harvestingStatus"
      id="addudp_harvestingstatus"
      placeholder={intl.formatMessage({
        id: 'ui-erm-usage.udp.form.placeholder.harvestingStatus',
      })}
      component={Select}
      dataOptions={useTranslateLabels(harvestingStatusOptions)}
      required
      validate={required}
      fullWidth
    />
  );
};

export default HarvestingStatusSelect;
