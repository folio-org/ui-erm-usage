import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { required } from '../../../util/validate';
import statusOptions from '../../../util/data/statusOptions';
import useTranslateLabels from '../../../util/hooks/useTranslateLabels';

const HarvestingStatusSelect = ({ disabled }) => {
  return (
    <Field
      component={Select}
      dataOptions={useTranslateLabels(statusOptions)}
      disabled={disabled}
      fullWidth
      id="addudp_harvestingstatus"
      label={<FormattedMessage id="ui-erm-usage.udpHarvestingConfig.harvestingStatus" />}
      name="harvestingConfig.harvestingStatus"
      required
      validate={required}
    />
  );
};

HarvestingStatusSelect.propTypes = {
  disabled: PropTypes.bool,
};

export default HarvestingStatusSelect;
