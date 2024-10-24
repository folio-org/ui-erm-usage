import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Select } from '@folio/stripes/components';

import { notRequired, required } from '../../../util/validate';
import reportReleaseOptions from '../../../util/data/reportReleaseOptions';

const ReportReleaseSelect = (props) => {
  return (
    <Field
      component={Select}
      dataOptions={reportReleaseOptions}
      defaultValue="5"
      fullWidth
      id={props.id}
      data={props.required ? 1 : 0}
      label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.reportRelease" />}
      name="harvestingConfig.reportRelease"
      onChange={props.onChange}
      required={props.required}
      validate={props.required ? required : notRequired}
    />
  );
};

ReportReleaseSelect.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
};

export default ReportReleaseSelect;
