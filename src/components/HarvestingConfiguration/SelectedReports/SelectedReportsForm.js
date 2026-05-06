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
    required: PropTypes.bool,
    selectedReports: PropTypes.arrayOf(PropTypes.string),
    supportedReports: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const counterReportsCurrentVersion = (this.props.supportedReports ?? []).map(r => ({
      label: r,
      value: r,
    }));

    return (
      <>
        <div className={formCss.label}>
          <Label required={this.props.required}>
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
          </Label>
        </div>
        <div className={css.reportListDropdownWrap}>
          <FieldArray
            name="harvestingConfig.requestedReports"
            required={this.props.required}
            // dont know why, but this seems to work
            validate={(value) => this.props.required && requiredArray(value)}
          >
            {({ fields }) => (
              <SelectReportType
                counterReportsCurrentVersion={counterReportsCurrentVersion}
                fields={fields}
                required={this.props.required}
                selectedReports={this.props.selectedReports}
              />
            )}
          </FieldArray>
        </div>
      </>
    );
  }
}

export default SelectedReportsForm;
