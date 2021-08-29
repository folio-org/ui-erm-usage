import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Select } from '@folio/stripes/components';
import { notRequired, required } from '../../../util/validate';

import reportReleaseOptions from '../../../util/data/reportReleaseOptions';

const propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
};

const ReportReleaseSelect = (props) => {
  const intl = useIntl();
  return (
    <Field
      label={
        <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease" />
      }
      name="harvestingConfig.reportRelease"
      id={props.id}
      placeholder={intl.formatMessage({
        id: 'ui-erm-usage.udp.form.placeholder.reportRelease',
      })}
      component={Select}
      dataOptions={reportReleaseOptions}
      required={props.required}
      validate={props.required ? required : notRequired}
      key={props.required ? 1 : 0}
      fullWidth
      onChange={props.onChange}
    />
  );
};

ReportReleaseSelect.propTypes = propTypes;

export default ReportReleaseSelect;
