import React from 'react';
import {
  Field,
} from 'react-final-form';
import {
  FormattedMessage
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  Select
} from '@folio/stripes/components';
import {
  required
} from '../../../util/validate';

import reportReleaseOptions from '../../../util/data/reportReleaseOptions';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

const ReportReleaseSelect = (props) => (
  <Field
    label={
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    }
    name="harvestingConfig.reportRelease"
    id={props.id}
    placeholder="Select the report release"
    component={Select}
    dataOptions={reportReleaseOptions}
    validate={required}
    fullWidth
    onChange={props.onChange}
  />
);

ReportReleaseSelect.propTypes = propTypes;

export default ReportReleaseSelect;
