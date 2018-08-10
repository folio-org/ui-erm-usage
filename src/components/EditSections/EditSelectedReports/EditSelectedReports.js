import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';
import reports from '../../../data/reports';

const renderSelectedReport = ({ field, fieldIndex }) => {
  const reportOptions = reports.selectedOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'Select reports' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: 'Select Report', value: '' }, ...reportOptions]}
    />
  );
};

renderSelectedReport.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const EditSelectedReports = () => (
  <RepeatableField
    name="requestedReports"
    addLabel="Add reports"
    addButtonId="clickable-add-language"
    template={[{
        render(fieldObj) { return renderSelectedReport(fieldObj); },
      }]}
  />
);

export default EditSelectedReports;
