import React, { Fragment } from 'react';
import {
  Field,
  FieldArray
} from 'redux-form';
import {
  TextField,
  RepeatableField
} from '@folio/stripes/components';
import formCss from '../../sharedStyles/form.css';

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
