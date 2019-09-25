import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
import { FieldArray, Field } from 'redux-form';
import {
  Icon,
  RepeatableField,
  Selection
} from '@folio/stripes/components';
import formCss from '../../../util/sharedStyles/form.css';
import counterReports from './data/counterReports';
import css from './SelectedReportsForm.css';

const omitUsedOptions = (list, usedValues, id) => {
  const unUsedValues = _.cloneDeep(list);
  if (usedValues) {
    usedValues.forEach((item, index) => {
      if (id !== index) {
        const usedValueIndex = _.findIndex(unUsedValues, v => {
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
  return _.filter(counterReports.getOptions(), ['counterVersion', '' + counterVersion]);
};

class SelectedReportsForm extends React.Component {
  static propTypes = {
    counterVersion: PropTypes.number,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.counterReports = counterReports.getOptions();
    this.counterReportsForVersion = getCounterReportsForVersion(props.counterVersion);
    this.counterReportsCurrentVersion = this.counterReportsForVersion;
  }

  componentDidUpdate(prevProps) {
    if (this.props.counterVersion !== prevProps.counterVersion) {
      const counterReportsForVersion = _.isNaN(this.props.counterVersion) ? [] : getCounterReportsForVersion(this.props.counterVersion);
      this.counterReportsCurrentVersion = counterReportsForVersion;
    }
  }

  renderFields(field, index, values) {
    const selectedReports = _.get(values, ['harvestingConfig', 'requestedReports'], {});
    const list = omitUsedOptions(this.counterReportsCurrentVersion, selectedReports, index);
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
    const { values } = this.context._reduxForm;

    const label = (
      <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.requestedReport">
        {(msg) => msg + ' *'}
      </FormattedMessage>
    );

    const reportsSelect = (
      <FieldArray
        addLabel={
          <Icon icon="plus-sign">
            {'Add report type'}
          </Icon>
        }
        component={RepeatableField}
        name="harvestingConfig.requestedReports"
        onAdd={fields => fields.push('')}
        renderField={(field, index) => this.renderFields(field, index, values)}
      />
    );

    return (
      <React.Fragment>
        <div className={formCss.label}>
          { label }
        </div>
        <div className={css.reportListDropdownWrap}>
          {reportsSelect}
        </div>
      </React.Fragment>
    );
  }
}

export default SelectedReportsForm;
