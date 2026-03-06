import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { Label } from '@folio/stripes/components';

import formCss from '../../../util/sharedStyles/form.css';
import { requiredArray } from '../../../util/validate';
import counterReportMapping from './data/counterReports';
import css from './SelectedReportsForm.css';
import SelectReportType from './SelectReportType';

const getCounterReportsForVersion = (counterVersion) => {
  return _.filter(counterReportMapping, ['counterVersion', counterVersion]);
};

class SelectedReportsForm extends React.Component {
  static propTypes = {
    counterVersion: PropTypes.string,
    required: PropTypes.bool,
    selectedReports: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props);

    this.counterReportsCurrentVersion = getCounterReportsForVersion(props.counterVersion);
  }

  componentDidUpdate(prevProps) {
    if (this.props.counterVersion !== prevProps.counterVersion) {
      this.counterReportsCurrentVersion = getCounterReportsForVersion(this.props.counterVersion);
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
            required={this.props.required}
            selectedReports={this.props.selectedReports}
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
