import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import counter4Reports from './data/counter4Reports';
import counter5Reports from './data/counter5Reports';

const renderSelectedReport = ({ field, fieldIndex }) => {
  const counter4Options = counter4Reports.selectedOptions(field);
  const counter5Options = counter5Reports.selectedOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'Select reports' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[
        { label: 'Counter 5 Reports', value: '', disabled: true },
        ...counter5Options,
        { label: 'Counter 4 Reports', value: '', disabled: true },
        ...counter4Options
      ]}
    />
  );
};

renderSelectedReport.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const SelectedReportsForm = () => (
  <RepeatableField
    name="requestedReports"
    addLabel="Add reports"
    addButtonId="clickable-add-report"
    template={[{
        render(fieldObj) { return renderSelectedReport(fieldObj); },
      }]}
  />
);

export default SelectedReportsForm;
