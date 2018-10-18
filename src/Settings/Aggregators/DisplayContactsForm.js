import React, { Fragment } from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import { Field, FieldArray } from 'redux-form';

class DisplayContactsForm extends React.Component {
  renderField = (identifier) => {
    return (
      <Fragment>
        <Field
          label="Add Display Contact"
          name={identifier}
          id="input-display-contact"
          component={TextField}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <FieldArray
        addLabel="+ Add Display Contact"
        component={RepeatableField}
        name="accountConfig.displayContact"
        renderField={this.renderField}
      />
    );
  }
}

// const DisplayContactsForm = () => (
//   <RepeatableField
//     name="accountConfig.displayContact"
//     addLabel="Add Display Contact"
//     addButtonId="clickable-add-language"
//     template={[{
//       component: TextField,
//     }]}
//   />
// );

export default DisplayContactsForm;
