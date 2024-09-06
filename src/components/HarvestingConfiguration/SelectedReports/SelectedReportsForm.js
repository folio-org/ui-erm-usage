import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Label } from '@folio/stripes/components';
import formCss from '../../../util/sharedStyles/form.css';
import counterReports from './data/counterReports';
import css from './SelectedReportsForm.css';

import SelectReportType from './SelectReportType';
import { requiredArray } from '../../../util/validate';

const getCounterReportsForVersion = (counterVersion) => {
  return _.filter(counterReports.getOptions(), [
    'counterVersion',
    counterVersion,
  ]);
};

class SelectedReportsForm extends React.Component {
  static propTypes = {
    counterVersion: PropTypes.string,
    selectedReports: PropTypes.arrayOf(PropTypes.string),
    required: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.counterReports = counterReports.getOptions();
    this.counterReportsForVersion = getCounterReportsForVersion(
      props.counterVersion
    );
    this.counterReportsCurrentVersion = this.counterReportsForVersion;
  }

  componentDidUpdate(prevProps) {
    if (this.props.counterVersion !== prevProps.counterVersion) {
      const counterReportsForVersion = getCounterReportsForVersion(this.props.counterVersion);
      this.counterReportsCurrentVersion = counterReportsForVersion;
    }
  }

  render() {
    const reportsSelect = (
      <FieldArray
        name="harvestingConfig.requestedReports"
        required={this.props.required}
        // dont know why, but this seems to work
        validate={(value) => this.props.required && requiredArray(value)}
      >
        {({ fields }) => (
          <SelectReportType
            counterReportsCurrentVersion={this.counterReportsCurrentVersion}
            fields={fields}
            selectedReports={this.props.selectedReports}
            required={this.props.required}
          />
        )}
      </FieldArray>
    );

    return (
      <>
        <div className={formCss.label}>
          <Label required={this.props.required}>
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
          </Label>
        </div>
        <div className={css.reportListDropdownWrap}>{reportsSelect}</div>
      </>
    );
  }
}

export default SelectedReportsForm;
