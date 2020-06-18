import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import stripesFinalForm from '@folio/stripes/final-form';
import { Button, Col, Row, TextField } from '@folio/stripes/components';

import FileUploader from '../FileUploader';

function FileUploadCard(props) {
  const [selectedFile, setSelectedFile] = useState();

  const { stripes } = props;

  const doUpload = (data) => {
    const okapiUrl = stripes.okapi.url;
    const httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': stripes.okapi.tenant,
      'X-Okapi-Token': stripes.store.getState().okapi.token,
      'Content-Type': 'application/octet-stream'
    });
    fetch(`${okapiUrl}/erm-usage/files`, {
      headers: httpHeaders,
      method: 'POST',
      body: data,
    })
      .then((response) => {
        if (response.status >= 400) {
          props.onFail();
        } else {
          props.onSuccess();
        }
      })
      .catch((err) => {
        const failText = this.props.intl.formatMessage({
          id: 'ui-erm-usage.report.upload.failed',
        });
        const infoText = failText + ' ' + err.message;
        props.onFail();
      });
  };

  const handleUpload = () => {
    // props.form.mutators.setFileName({}, selectedFile.name);
    // props.form.mutators.setFileSize({}, selectedFile.size);
    console.log('UPLOAD');
  };

  const handleSelectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    // props.form.mutators.setFileName({}, currentFile.name);
    // props.form.mutators.setFileSize({}, currentFile.size);
    setSelectedFile(currentFile);
    props.form.mutators.setFileName({}, currentFile.name);
    props.form.mutators.setFileSize({}, currentFile.size);
    doUpload();
  };

  return (
    <form
      // className={BasicStyle.styleForFormRoot}
      data-test-custom-report-form-page
      id="form-custom-report"
      onSubmit={props.handleSubmit}
    >
      <Row>
        <Col xs={12} md={6}>
          <Row>
            <Col xs={12}>
              <Field
                autoFocus
                component={TextField}
                data-test-custom-report-year
                id="custom-report-year"
                label="YEAR (YYYY)"
                name="year"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Field
                component={TextField}
                data-test-custom-report-note
                id="custom-report-note"
                label="NOTE"
                name="note"
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <FileUploader
              onSelectFile={handleSelectFile}
              selectedFile={selectedFile}
            />
          </Row>
        </Col>
      </Row>
      <Row>
        <Button
          data-test-udp-form-submit-button
          marginBottom0
          id="clickable-createnewudp"
          buttonStyle="primary mega"
          type="submit"
        >
          SAVE
        </Button>
      </Row>
    </form>
  );
}

FileUploadCard.propTypes = {
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setFileName: PropTypes.func,
      setFileSize: PropTypes.func,
    }),
  }),
  handleSubmit: PropTypes.func.isRequired,
  onFail: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default stripesFinalForm({
  navigationCheck: true,
  mutators: {
    setFileName: (args, state, tools) => {
      tools.changeValue(state, 'fileName', () => args[1]);
    },
    setFileSize: (args, state, tools) => {
      tools.changeValue(state, 'fileSize', () => args[1]);
    },
  },
})(FileUploadCard);
