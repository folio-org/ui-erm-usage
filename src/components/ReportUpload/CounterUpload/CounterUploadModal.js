import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field, Form } from 'react-final-form';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  KeyValue,
  Modal,
  ModalFooter,
  TextField,
} from '@folio/stripes/components';

import FileUploader from '../FileUploader';
import formCss from '../../../util/sharedStyles/form.css';

function CounterUploadModal({ intl, onClose, onSubmit, open }) {
  const footer = (isValid, handleSubmit, handleReset) => {
    return (
      <ModalFooter>
        <Button buttonStyle="primary" disabled={!isValid} onClick={handleSubmit}>
          <FormattedMessage id="ui-erm-usage.general.save" />
        </Button>
        <Button
          onClick={() => {
            handleReset();
            onClose();
          }}
        >
          <FormattedMessage id="ui-erm-usage.general.cancel" />
        </Button>
      </ModalFooter>
    );
  };

  const validateFormValues = (values) => {
    const errors = {};
    if (!values.file) {
      errors.file = 'Required';
    }
    if (values.reportEditedManually && !values.editReason) {
      errors.editReason = 'Required';
    }
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validateFormValues}
      render={({ handleSubmit, form, values }) => (
        <Modal
          closeOnBackgroundClick
          footer={footer(form.getState().valid, handleSubmit, form.reset)}
          id="upload-counter-modal"
          open={open}
          label={intl.formatMessage({ id: 'ui-erm-usage.statistics.counter.upload' })}
        >
          <div>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.general.info" />}
              value={<FormattedMessage id="ui-erm-usage.report.upload.info" />}
            />
          </div>
          <div>
            <Col xs={8} className={formCss.centered}>
              <Field name="file">
                {({ input: { onChange } }) => <FileUploader onChange={onChange} />}
              </Field>
            </Col>
          </div>
          <div className={formCss.marginTop}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.statistics.selectedFile" />}
              value={values.file?.path}
            />
          </div>
          <div className={formCss.marginTop}>
            <Field
              component={Checkbox}
              id="addcounterreport_reportEditedManually"
              initialValue={false}
              label={<FormattedMessage id="ui-erm-usage.report.upload.editedManually" />}
              name="reportEditedManually"
              type="checkbox"
            />
          </div>
          <div className={formCss.marginTop}>
            <Field
              component={TextField}
              disabled={values.reportEditedManually?.value === false}
              fullWidth
              initialValue=""
              id="addcounterreport_editReason"
              label={<FormattedMessage id="ui-erm-usage.report.upload.editReason" />}
              name="editReason"
              placeholder={intl.formatMessage({ id: 'ui-erm-usage.report.upload.editReason.placeholder' })}
              required={values.reportEditedManually?.value === true}
            />
          </div>
        </Modal>
      )}
    />
  );
}

CounterUploadModal.propTypes = {
  intl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default injectIntl(stripesConnect(CounterUploadModal));
