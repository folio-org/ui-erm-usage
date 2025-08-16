import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import Monthpicker from '../../../util/Monthpicker';

const HarvestingEndField = () => {
  const intl = useIntl();

  return (
    <Field
      backendDateFormat="yyyy-MM"
      component={Monthpicker}
      // dateFormat="YYYY-MM"
      id="input-harvestingEnd"
      name="harvestingConfig.harvestingEnd"
      // textLabel={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
      textLabel={intl.formatMessage({ id: 'ui-erm-usage.udpHarvestingConfig.harvestingEnd' })}
      // validate={(value, allValues) => {
      //   const start = allValues.harvestingConfig?.harvestingStart;
      //   if (start && value && new Date(value) < new Date(start)) {
      //     return 'xxx Enddatum muss nach Startdatum liegen';
      //   }
      // }}
    />
  );
};

export default HarvestingEndField;
