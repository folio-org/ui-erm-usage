import PropTypes from 'prop-types';
import { filter, isNaN } from 'lodash';
import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Label } from '@folio/stripes/components';

import formCss from '../../../util/sharedStyles/form.css';
import counterReports from './data/counterReports';
import css from './SelectedReportsForm.css';
import SelectReportType from './SelectReportType';
import { requiredArray } from '../../../util/validate';

const getCounterReportsForVersion = (counterVersion) => {
  return filter(counterReports.getOptions(), [
    'counterVersion',
    '' + counterVersion,
  ]);
};

const SelectedReportsForm = ({
  counterVersion,
  selectedReports,
  required,
}) => {
  const counterReportsForVersion = getCounterReportsForVersion(counterVersion);
  const [counterReportsCurrentVersion, setCounterReportsCurrentVersion] = useState(counterReportsForVersion);

  useEffect(() => {
    const currCounterReportsForVersion = isNaN(counterVersion)
      ? []
      : getCounterReportsForVersion(counterVersion);
    setCounterReportsCurrentVersion(currCounterReportsForVersion);
  }, [counterVersion]);

  const reportsSelect = (
    <FieldArray
      name="harvestingConfig.requestedReports"
      required={required}
      // dont know why, but this seems to work
      validate={(value) => required && requiredArray(value)}
    >
      {({ fields }) => (
        <SelectReportType
          counterReportsCurrentVersion={counterReportsCurrentVersion}
          fields={fields}
          selectedReports={selectedReports}
          required={required}
        />
      )}
    </FieldArray>
  );

  return (
    <>
      <div className={formCss.label}>
        <Label required={required}>
          <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
        </Label>
      </div>
      <div className={css.reportListDropdownWrap}>{reportsSelect}</div>
    </>
  );
};

SelectedReportsForm.propTypes = {
  counterVersion: PropTypes.number,
  selectedReports: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool
};

export default SelectedReportsForm;
