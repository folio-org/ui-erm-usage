import PropTypes from 'prop-types';
import {
  Field,
  Form,
} from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  KeyValue,
  Modal,
  ModalFooter,
  TextField,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import formCss from '../../../util/sharedStyles/form.css';
import FileUploader from '../FileUploader';

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
      render={({ handleSubmit, form, values }) => (
        <Modal
          closeOnBackgroundClick
          footer={footer(form.getState().valid, handleSubmit, form.reset)}
          id="upload-counter-modal"
          label={intl.formatMessage({ id: 'ui-erm-usage.statistics.counter.upload' })}
          open={open}
        >
          <div>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.general.info" />}
              value={<FormattedMessage id="ui-erm-usage.report.upload.info" />}
            />
          </div>
          <div>
            <Col className={formCss.centered} xs={8}>
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
              id="addcounterreport_editReason"
              initialValue=""
              label={<FormattedMessage id="ui-erm-usage.report.upload.editReason" />}
              name="editReason"
              placeholder={intl.formatMessage({ id: 'ui-erm-usage.report.upload.editReason.placeholder' })}
              required={values.reportEditedManually?.value === true}
            />
          </div>
        </Modal>
      )}
      validate={validateFormValues}
    />
  );
}

CounterUploadModal.propTypes = {
  intl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default injectIntl(stripesConnect(CounterUploadModal));
