import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Button, Col, Icon, KeyValue, Loading, Label, Row } from '@folio/stripes/components';

import { Field } from 'react-final-form';
import FileUploader from '../FileUploader';

function NonCounterUploadFile({ fileId, handlers, isUploading, onSelectFile, file }) {
  const renderSelectedFile = () => {
    let downloadButton = '';
    if (_.isNil(file) || _.isNil(fileId)) {
      downloadButton = <FormattedMessage id="ui-erm-usage.statistics.custom.selectFileFirst" />;
    } else {
      downloadButton = (
        <Button
          data-test-doc-file
          buttonStyle="link"
          onClick={() => handlers.doDownloadFile(fileId, file.name)}
        >
          <Icon icon="external-link">{file.name}</Icon>
        </Button>
      );
    }
    return (
      <KeyValue
        label={
          <Label required>
            <FormattedMessage id="ui-erm-usage.statistics.custom.selectedFile" />
          </Label>
        }
        value={downloadButton}
      />
    );
  };

  const renderUpload = () => {
    if (isUploading) {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" />
          <Loading />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Col xs={12} md={12}>
      <Row>
        <FormattedMessage id="ui-erm-usage.statistics.custom.selectFileUpload" />
      </Row>
      <Row>
        <Col xs={10}>
          <Field name="file">
            {({ input: { onChange } }) => (
              <FileUploader
                onChange={(e) => {
                  onChange(e);
                  onSelectFile(e);
                }}
              />
            )}
          </Field>
        </Col>
      </Row>
      <Row>
        <></>
      </Row>
      <Row>
        <Col xs={10}>{renderSelectedFile()}</Col>
      </Row>
      <Row>{renderUpload()}</Row>
    </Col>
  );
}

NonCounterUploadFile.propTypes = {
  file: PropTypes.shape(),
  fileId: PropTypes.string,
  handlers: PropTypes.shape({
    doDownloadFile: PropTypes.func,
  }),
  isUploading: PropTypes.bool.isRequired,
  onSelectFile: PropTypes.func.isRequired,
};

export default injectIntl(NonCounterUploadFile);
