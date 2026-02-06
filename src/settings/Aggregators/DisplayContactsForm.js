import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import DisplayContact from './DisplayContact';
import formCss from '../../util/sharedStyles/form.css';

const DisplayContactsForm = () => {
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
      />
    </>
  );
};

export default DisplayContactsForm;
