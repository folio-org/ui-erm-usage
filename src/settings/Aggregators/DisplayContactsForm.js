import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import DisplayContact from './DisplayContact';
import formCss from '../../util/sharedStyles/form.css';

const DisplayContactsForm = ({ ...props }) => {
  return (
    <>
      <div className={formCss.label}>
        <FormattedMessage id="ui-erm-usage.aggregator.config.contacts" />
      </div>
      <FieldArray
        component={DisplayContact}
        name="accountConfig.displayContact"
        label="Displaycontact"
        id="display_contacts"
        {...props}
      />
    </>
  );
};

export default DisplayContactsForm;
