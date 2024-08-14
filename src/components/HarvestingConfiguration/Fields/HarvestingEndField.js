import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import { yearMonth } from '../../../util/validate';

const HarvestingEndField = () => (
  <Field
    label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingEnd" />}
    name="harvestingConfig.harvestingEnd"
    id="input-harvestingEnd"
    component={TextField}
    placeholder="YYYY-MM"
    validate={yearMonth}
    fullWidth
  />
);

export default HarvestingEndField;
