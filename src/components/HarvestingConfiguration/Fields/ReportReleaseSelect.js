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

import reportReleaseOptions from '../../../util/data/reportReleaseOptions';

const ReportReleaseSelect = () => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    }
    name="harvestingConfig.reportRelease"
    id="addudp_reportrelease"
    placeholder="Select the report release"
    component={Select}
    dataOptions={reportReleaseOptions}
    fullWidth
  />
);

export default ReportReleaseSelect;
