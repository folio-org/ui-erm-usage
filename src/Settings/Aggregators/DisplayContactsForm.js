import React, { Fragment } from 'react';
import {
  TextField,
  RepeatableField
} from '@folio/stripes-components';
import formCss from '@folio/stripes-components/lib/sharedStyles/form.css';
import { Field, FieldArray } from 'redux-form';

class DisplayContactsForm extends React.Component {
  renderField = (identifier) => {
    return (
      <Fragment>
        <Field
          name={identifier}
          id="input-display-contact"
          component={TextField}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <div className={formCss.label}>
          Contacts
        </div>
        <FieldArray
          addLabel="+ Add contact"
          component={RepeatableField}
          name="accountConfig.displayContact"
          renderField={this.renderField}
        />
      </Fragment>
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
