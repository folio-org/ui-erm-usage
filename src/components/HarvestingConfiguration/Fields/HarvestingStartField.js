import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  composeValidators,
  required,
  yearMonth,
  harvestingStartValidator,
} from '../../../util/validate';
import Monthpicker from '../../../util/Monthpicker';

const HarvestingStartField = ({ isRequired, ...rest }) => {
  return (
    <Field
      backendDateFormat="YYYY-MM"
      component={Monthpicker}
      data={isRequired ? 1 : 0}
      id="input-harvestingStart"
      required={isRequired}
      name="harvestingConfig.harvestingStart"
      textLabel={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />}
      // validate={isRequired ? harvestingStartValidator : yearMonth}
      validate={isRequired ? composeValidators(required, yearMonth) : yearMonth}
      {...rest}
    />
  );
};

HarvestingStartField.propTypes = {
  isRequired: PropTypes.bool,
};

export default HarvestingStartField;
