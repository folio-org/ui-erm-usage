import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import reportReleaseOptions from '../../../util/data/reportReleaseOptions';
import {
  notRequired,
  required,
} from '../../../util/validate';

const ReportReleaseSelect = (props) => {
  return (
    <Field
      component={Select}
      data={props.required ? 1 : 0}
      dataOptions={reportReleaseOptions}
      fullWidth
      id={props.id}
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
  required: PropTypes.bool,
};

export default ReportReleaseSelect;
