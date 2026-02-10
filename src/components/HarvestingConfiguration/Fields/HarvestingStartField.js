import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';

import { Monthpicker } from '@folio/stripes-leipzig-components';

const HarvestingStartField = ({ isRequired }) => {
  const intl = useIntl();

  return (
    <Monthpicker
      backendDateFormat="YYYY-MM"
      isRequired={isRequired}
      name="harvestingConfig.harvestingStart"
      textLabel={intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.harvestingStart' })}
    />
  );
};

HarvestingStartField.propTypes = {
  isRequired: PropTypes.bool,
};

export default HarvestingStartField;
