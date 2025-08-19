import { FormattedMessage } from 'react-intl';

import Monthpicker from '../../../util/Monthpicker';

const HarvestingEndField = () => (
  <Monthpicker
    backendDateFormat="YYYY-MM"
    id="input-harvestingEnd"
    name="harvestingConfig.harvestingEnd"
    textLabel={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
  />
);

export default HarvestingEndField;
