import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import counter4Reports from './data/counter4Reports';
import counter5Reports from './data/counter5Reports';

class SelectedReportsForm extends React.Component {
  renderField = (identifier, index) => {
    const counter4Options = counter4Reports.getOptions();
    const counter5Options = counter5Reports.getOptions();
    return (
      <Fragment>
        <Field
          label={index === 0 ? 'Select reports' : null}
          name={identifier}
          type="text"
          component={Select}
          dataOptions={[
            { label: 'Counter 4 Reports', value: '', disabled: true },
            ...counter4Options,
            { label: 'Counter 5 Reports', value: '', disabled: true },
            ...counter5Options
          ]}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <FieldArray
        addLabel="+ Add report"
        component={RepeatableField}
        name="requestedReports"
        renderField={this.renderField}
      />
    );
  }
}

export default SelectedReportsForm;
