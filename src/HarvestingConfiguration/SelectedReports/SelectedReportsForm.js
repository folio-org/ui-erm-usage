import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import formCss from '@folio/stripes-components/lib/sharedStyles/form.css';
import counter4Reports from './data/counter4Reports';
import counter5Reports from './data/counter5Reports';

class SelectedReportsForm extends React.Component {

  constructor(props) {
    super(props);

    this.counter4Options = counter4Reports.getOptions();
    this.counter5Options = counter5Reports.getOptions();
  }

  renderField = (identifier, index) => {
    return (
      <Field
        name={identifier}
        component={Select}
        dataOptions={[
          { label: 'Counter 4 Reports', value: '', disabled: true },
          ...this.counter4Options,
          { label: 'Counter 5 Reports', value: '', disabled: true },
          ...this.counter5Options
        ]}
      />
    );
  }

  render() {
    return (
      <Fragment>
        <div className={formCss.label}>
          {this.props.label}
        </div>
        <FieldArray
          addLabel="+ Add report"
          component={RepeatableField}
          name="requestedReports"
          renderField={this.renderField}
        />
      </Fragment>
    );
  }
}

SelectedReportsForm.propTypes = {
  label: PropTypes.string,
};

export default SelectedReportsForm;
