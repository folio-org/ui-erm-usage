import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const DisplayContactsForm = () => (
  <RepeatableField
    name="accountConfig.displayContact"
    addLabel="Add Display Contact"
    addButtonId="clickable-add-language"
    template={[{
        component: TextField,
      }]}
  />
);

export default DisplayContactsForm;
