import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import harvestingViaOptions from '../../../util/data/harvestingViaOptions';
import {
  notRequired,
  required,
} from '../../../util/validate';

const HarvestingViaSelect = (props) => {
  return (
    <Field
      component={Select}
      data={props.required ? 1 : 0}
      dataOptions={harvestingViaOptions}
      fullWidth
      id="harvestingConfig.harvestVia"
      label={<FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.harvestViaAggregator" />}
      name="harvestingConfig.harvestVia"
      onChange={props.onChange}
      required={props.required}
      validate={props.required ? required : notRequired}
    />
  );
};

HarvestingViaSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default HarvestingViaSelect;
