import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  Icon,
  Label,
  RepeatableField,
  Selection,
} from '@folio/stripes/components';
import formCss from '../../../util/sharedStyles/form.css';
import counterReports from './data/counterReports';
import css from './SelectedReportsForm.css';

const omitUsedOptions = (list, usedValues, id) => {
  const unUsedValues = _.cloneDeep(list);
  if (!_.isEmpty(usedValues)) {
    usedValues.forEach((item, index) => {
      if (id !== index) {
        const usedValueIndex = _.findIndex(unUsedValues, (v) => {
          return v.label === item;
        });
        if (usedValueIndex !== -1) {
          unUsedValues.splice(usedValueIndex, 1);
        }
      }
    });
  }
  return unUsedValues;
};

const getCounterReportsForVersion = (counterVersion) => {
  return _.filter(counterReports.getOptions(), [
    'counterVersion',
    '' + counterVersion,
  ]);
};

class SelectedReportsForm extends React.Component {
  static propTypes = {
    counterVersion: PropTypes.number,
    selectedReports: PropTypes.arrayOf(PropTypes.string),
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
      const counterReportsForVersion = _.isNaN(this.props.counterVersion)
        ? []
        : getCounterReportsForVersion(this.props.counterVersion);
      this.counterReportsCurrentVersion = counterReportsForVersion;
    }
  }

  renderFields(field, index) {
    const { selectedReports } = this.props;
    const list = omitUsedOptions(
      this.counterReportsCurrentVersion,
      selectedReports,
      index
    );
    return (
      <Field
        component={Selection}
        dataOptions={list}
        label="Report type"
        name={field}
      />
    );
  }

  render() {
    const reportsSelect = (
      <FieldArray
        addLabel={<Icon icon="plus-sign">Add report type</Icon>}
        component={RepeatableField}
        name="harvestingConfig.requestedReports"
        onAdd={(fields) => fields.push('')}
        renderField={(field, index) => this.renderFields(field, index)}
        validate={(values) => {
          if (!values || values.length < 1) {
            return 'Min 1 entry';
          }
          return undefined;
        }}
      />
    );

    return (
      <React.Fragment>
        <div className={formCss.label}>
          <Label required>
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport" />
          </Label>
        </div>
        <div className={css.reportListDropdownWrap}>{reportsSelect}</div>
      </React.Fragment>
    );
  }
}

export default SelectedReportsForm;
