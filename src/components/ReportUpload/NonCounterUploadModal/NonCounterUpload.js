import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row, TextField } from '@folio/stripes/components';

import FileUploader from '../FileUploader';

function FileUploadCard(props) {
  const [selectedFile, setSelectedFile] = useState();

  const { stripes } = props;

  const doUploadRawFile = (file) => {
    const okapiUrl = stripes.okapi.url;
    const httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        'X-Okapi-Token': stripes.store.getState().okapi.token,
        'Content-Type': 'application/octet-stream',
      }
    );
    fetch(`${okapiUrl}/erm-usage/files`, {
      headers: httpHeaders,
      method: 'POST',
      body: file,
    })
      .then((response) => {
        if (response.status >= 400) {
          // props.onFail();
        } else {
          // props.onSuccess();
          response.json().then((json) => {
            props.mutators.setFileId({}, json.id);
            props.mutators.setFileName({}, file.name);
            props.mutators.setFileSize({}, file.size);
            props.mutators.setProviderId({}, props.udpId);
          });
        }
      })
      .catch((err) => {
        const failText = this.props.intl.formatMessage({
          id: 'ui-erm-usage.report.upload.failed',
        });
        const infoText = failText + ' ' + err.message;
        // props.onFail();
      });
  };

  const handleSelectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setSelectedFile(currentFile);
    doUploadRawFile(currentFile);
  };

  return (
    <>
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
    </>
  );
}

FileUploadCard.propTypes = {
  mutators: PropTypes.shape({
    setFileId: PropTypes.func,
    setFileName: PropTypes.func,
    setFileSize: PropTypes.func,
    setProviderId: PropTypes.func,
  }),
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default FileUploadCard;
