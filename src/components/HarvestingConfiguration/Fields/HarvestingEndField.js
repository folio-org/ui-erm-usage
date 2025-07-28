import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import Monthpicker from '../../../util/Monthpicker';

const HarvestingEndField = () => (
  <Field
    backendDateFormat="YYYY-MM"
    component={Monthpicker}
    // dateFormat="YYYY-MM"
    id="input-harvestingEnd"
    name="harvestingConfig.harvestingEnd"
    textLabel={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
  />
);

export default HarvestingEndField;
