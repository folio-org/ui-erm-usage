import { useIntl } from 'react-intl';

import { Monthpicker } from '@folio/stripes-leipzig-components';

import { YEAR_MONTH_FORMAT } from '../../../util/constants';

const HarvestingEndField = () => {
  const intl = useIntl();

  return (
    <Monthpicker
      backendDateFormat={YEAR_MONTH_FORMAT}
      name="harvestingConfig.harvestingEnd"
      textLabel={intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.harvestingEnd' })}
    />
  );
};

export default HarvestingEndField;
