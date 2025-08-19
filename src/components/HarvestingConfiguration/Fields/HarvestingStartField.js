import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Monthpicker from '../../../util/Monthpicker';

const HarvestingStartField = ({ isRequired }) => {
  return (
    <Monthpicker
      backendDateFormat="YYYY-MM"
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
