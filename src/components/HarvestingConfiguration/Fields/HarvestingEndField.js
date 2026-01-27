import { useIntl } from 'react-intl';

import { Monthpicker } from '@folio/stripes-leipzig-components';

const HarvestingEndField = () => {
  const intl = useIntl();

  return (
    <Monthpicker
      backendDateFormat="YYYY-MM"
      id="input-harvestingEnd"
      name="harvestingConfig.harvestingEnd"
      textLabel={intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.harvestingEnd' })}
    />
  );
};

export default HarvestingEndField;
