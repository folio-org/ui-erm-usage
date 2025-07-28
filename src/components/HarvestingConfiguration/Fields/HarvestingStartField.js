import { PropTypes } from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import Monthpicker from '../../../util/Monthpicker';

const HarvestingStartField = ({ isRequired }) => {
  return (
    <Field
      backendDateFormat="YYYY-MM"
      component={Monthpicker}
      data={isRequired ? 1 : 0}
      id="input-harvestingStart"
      isRequired={isRequired}
      name="harvestingConfig.harvestingStart"
      textLabel={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStart" />}
    />
  );
};

HarvestingStartField.propTypes = {
  isRequired: PropTypes.bool,
};

export default HarvestingStartField;
