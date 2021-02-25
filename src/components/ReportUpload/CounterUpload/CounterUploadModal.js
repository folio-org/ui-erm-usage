import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
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
  Row,
  TextField,
} from '@folio/stripes/components';
import FileUploader from '../FileUploader';

function CounterUploadModal({
  intl,
  onClose,
  onSubmit,
  open,
  selectedFile,
  setSelectedFile,
}) {
  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
  };

  const selectFile = (acceptedFiles, changeFormFn) => {
    const currentFile = acceptedFiles[0];

    getBase64(currentFile, (result) => {
      changeFormFn('contents.data', result);
    });

    setSelectedFile(currentFile);
  };

  const footer = (isValid, handleSubmit, onReset) => {
    return (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          disabled={!isValid}
          id="save-counter-button"
          onClick={(report) =>
            handleSubmit(report, onReset).then(() => {
              onReset();
            })
          }
        >
          <FormattedMessage id="ui-erm-usage.general.save" />
        </Button>
        <Button
          id="cancel-upload-counter-report"
          onClick={() => {
            onReset();
            setSelectedFile({});
            onClose();
          }}
        >
          <FormattedMessage id="ui-erm-usage.general.cancel" />
        </Button>
      </ModalFooter>
    );
  };

  const isReportEditedManually = (isEditedManually) => {
    if (_.isNil(isEditedManually)) {
      return false;
    }
    return isEditedManually.value;
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        setData: (args, state, utils) => {
          utils.changeValue(state, 'contents.data', () => args[1]);
        },
      }}
      validate={(values) => {
        const errors = {};
        if (!values.contents) {
          errors.contents = 'Required';
        }
        if (values.reportMetadata) {
          const md = values.reportMetadata;
          if (md.reportEditedManually && !md.editReason) {
            errors.reportMetadata = 'Required';
          }
        }
        return errors;
      }}
      render={({ handleSubmit, form }) => (
        <form data-test-counter-report-form-page id="form-counter-report">
          <Modal
            closeOnBackgroundClick
            footer={footer(form.getState().valid, handleSubmit, form.reset)}
            id="upload-counter-modal"
            open={open}
            label={intl.formatMessage({
              id: 'ui-erm-usage.statistics.counter.upload',
            })}
          >
            <div className="upload-counter-modal-div">
              <Row>
                <Col xs={8}>
                  <Row>
                    <KeyValue
                      label={
                        <FormattedMessage id="ui-erm-usage.general.info" />
                      }
                      value={
                        <FormattedMessage id="ui-erm-usage.report.upload.info" />
                      }
                    />
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FileUploader
                        onSelectFile={(e) => selectFile(e, form.change)}
                        selectedFile={selectedFile}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <KeyValue
                        label="SELECTED FILE"
                        value={
                          _.isNil(selectedFile) ? 'Required' : selectedFile.name
                        }
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={4}>
                  <Row style={{ marginTop: '25px' }}>
                    <Field
                      component={Checkbox}
                      id="addcounterreport_reportEditedManually"
                      initialValue={false}
                      label={
                        <FormattedMessage id="ui-erm-usage.report.upload.editedManually" />
                      }
                      name="reportMetadata.reportEditedManually"
                      type="checkbox"
                    />
                  </Row>
                  <Row style={{ marginTop: '15px' }}>
                    <Field
                      component={TextField}
                      disabled={
                        !isReportEditedManually(
                          form.getFieldState(
                            'reportMetadata.reportEditedManually'
                          )
                        )
                      }
                      fullWidth
                      initialValue=""
                      id="addcounterreport_editReason"
                      label={
                        <FormattedMessage id="ui-erm-usage.report.upload.editReason" />
                      }
                      name="reportMetadata.editReason"
                      placeholder={intl.formatMessage({
                        id: 'ui-erm-usage.report.upload.editReason.placeholder',
                      })}
                      required={isReportEditedManually(
                        form.getFieldState(
                          'reportMetadata.reportEditedManually'
                        )
                      )}
                    />
                  </Row>
                </Col>
              </Row>
            </div>
          </Modal>
        </form>
      )}
    />
  );
}

CounterUploadModal.propTypes = {
  intl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mutators: PropTypes.shape({
    setContent: PropTypes.func,
  }),
  selectedFile: PropTypes.shape().isRequired,
  setSelectedFile: PropTypes.func.isRequired,
};

export default injectIntl(stripesConnect(CounterUploadModal));
