import React, { Fragment } from 'react';
import {
  FieldArray
} from 'redux-form';
import DisplayContact from './DisplayContact';
import formCss from '../../util/sharedStyles/form.css';

class DisplayContactsForm extends React.Component {
  render() {
    return (
      <Fragment>
        <div className={formCss.label}>
          Contacts
        </div>
        <FieldArray
          component={DisplayContact}
          name="accountConfig.displayContact"
          label="Displaycontact"
          id="display_contacts"
          {...this.props}
        />
      </Fragment>
    );
  }
}

export default DisplayContactsForm;
