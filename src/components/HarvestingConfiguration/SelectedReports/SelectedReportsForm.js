import PropTypes from 'prop-types';
import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { Label } from '@folio/stripes/components';

import formCss from '../../../util/sharedStyles/form.css';
import { requiredArray } from '../../../util/validate';
import css from './SelectedReportsForm.css';
import SelectReportType from './SelectReportType';

class SelectedReportsForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    selectedReports: PropTypes.arrayOf(PropTypes.string),
    supportedReports: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const {
      disabled,
      required,
      selectedReports,
      supportedReports,
    } = this.props;
    const counterReportsCurrentVersion = (supportedReports ?? []).map(r => ({
      label: r,
      value: r,
    }));

    return (
      <>
        <div className={formCss.label}>
          <Label required={required}>
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
          </Label>
        </div>
        <div className={css.reportListDropdownWrap}>
          <FieldArray
            name="harvestingConfig.requestedReports"
            required={required}
            // Not the destructured `required`: this.props always reflects current props when called.
            /* With a functional component useRef would be needed to achieve the same effect.
               Since react-final-form-arrays caches the validator at mount via useConstant. */
            validate={(value) => this.props.required && requiredArray(value)}
          >
            {({ fields }) => (
              <SelectReportType
                counterReportsCurrentVersion={counterReportsCurrentVersion}
                disabled={disabled}
                fields={fields}
                required={required}
                selectedReports={selectedReports}
              />
            )}
          </FieldArray>
        </div>
      </>
    );
  }
}

export default SelectedReportsForm;
