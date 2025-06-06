import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Button, Col, Icon, KeyValue, Label, Loading, Row } from '@folio/stripes/components';

import FileUploader from '../FileUploader';

function NonCounterUploadFile({ fileId, handlers, isUploading, onSelectFile, file }) {
  const renderSelectedFile = () => {
    let downloadButton = '';
    if (isNil(file) || isNil(fileId)) {
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
            <FormattedMessage id="ui-erm-usage.statistics.selectedFile" />
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
          <FileUploader
            onChange={(e) => {
              onSelectFile(e);
            }}
          />
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
