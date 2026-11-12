import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import {
  useContext,
  useState,
} from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { useOkapiKyMutation } from '@folio/stripes-leipzig-components';
import {
  Col,
  RadioButton,
  Row,
  TextField,
} from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';

import {
  API_FILES,
  KEY_FILES,
} from '../../../util/constants';
import NonCounterUploadFile from './NonCounterUploadFile';
import NonCounterUploadLink from './NonCounterUploadLink';

function NonCounterUploadInnerForm(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [fileId, setFileId] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [useFile, setUseFile] = useState(true);
  const [linkUrl, setLinkUrl] = useState();

  const { intl } = props;
  const callout = useContext(CalloutContext);

  const handleFail = (msg) => {
    props.stripes.logger.log('action', msg);
    callout.sendCallout({
      type: 'error',
      message: msg,
      timeout: 0,
    });
  };

  const { useCreate, useDelete } = useOkapiKyMutation({
    mutationKey: KEY_FILES,
    api: API_FILES,
    id: fileId,
  });
  const { mutateAsync: uploadFile } = useCreate({
    kyOptions: (file) => ({
      body: file,
      headers: { 'Content-Type': 'application/octet-stream' },
      // large files may take longer than the default timeout of useOkapiKy
      timeout: false,
    }),
  });
  const { mutateAsync: deleteFile } = useDelete();

  // HTTP errors only show the general message; other errors show general message and details
  const handleRequestError = (err) => {
    const failText = intl.formatMessage({ id: 'ui-erm-usage.report.upload.failed' });
    handleFail(err.response ? failText : `${failText} ${err.message}`);
  };

  const doUploadRawFile = (file) => {
    const { mutators, udpId } = props;
    setShowUploadModal(true);
    uploadFile(file)
      .then((json) => {
        setShowUploadModal(false);
        mutators.setFileId({}, json.id);
        mutators.setFileName({}, file.name);
        mutators.setFileSize({}, file.size);
        mutators.setProviderId({}, udpId);
        mutators.setLinkUrl({}, null);
        setFileId(json.id);
      })
      .catch((err) => {
        setShowUploadModal(false);
        handleRequestError(err);
      });
  };

  const doDeleteRawFile = () => {
    const { mutators } = props;
    deleteFile()
      .then(() => {
        setFileId();
        mutators.setFileId({}, null);
        mutators.setFileName({}, null);
        mutators.setFileSize({}, null);
      })
      .catch(handleRequestError);
  };

  const handleSelectFile = (acceptedFile) => {
    setSelectedFile(acceptedFile);
    doUploadRawFile(acceptedFile);
  };

  const handleLinkUrlChange = (e) => {
    const { mutators, udpId } = props;
    const value = e.target.value;

    if (!isNil(fileId)) {
      doDeleteRawFile();
    }

    setLinkUrl(value);
    mutators.setFileId({}, null);
    mutators.setLinkUrl({}, value);
    mutators.setProviderId({}, udpId);
  };

  const renderLinkOrFile = () => {
    if (useFile) {
      return (
        <NonCounterUploadFile
          file={selectedFile}
          fileId={fileId}
          isUploading={showUploadModal}
          onSelectFile={handleSelectFile}
        />
      );
    } else {
      return (
        <NonCounterUploadLink
          linkUrl={linkUrl}
          onChangeLinkUrl={handleLinkUrlChange}
        />
      );
    }
  };

  return (
    <Row>
      <Col md={12} xs={12}>
        <Row>
          <Col xs={10}>
            <Field
              autoFocus
              component={TextField}
              id="custom-report-year"
              label={<FormattedMessage id="ui-erm-usage.general.year" />}
              name="year"
              placeholder="YYYY"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <Field
              component={TextField}
              id="custom-report-note"
              label={<FormattedMessage id="ui-erm-usage.general.note" />}
              name="note"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <RadioButton
              checked={useFile}
              id="custom-report-file-radio"
              inline
              label={<FormattedMessage id="ui-erm-usage.statistics.custom.uploadFile" />}
              onChange={() => {
                setUseFile(!useFile);
              }}
            />
            <RadioButton
              checked={!useFile}
              id="custom-report-link-radio"
              inline
              label={<FormattedMessage id="ui-erm-usage.statistics.custom.linkFile" />}
              onChange={() => {
                setUseFile(!useFile);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={10}>{renderLinkOrFile()}</Col>
        </Row>
      </Col>
    </Row>
  );
}

NonCounterUploadInnerForm.propTypes = {
  intl: PropTypes.object,
  mutators: PropTypes.shape({
    setFileId: PropTypes.func,
    setFileName: PropTypes.func,
    setFileSize: PropTypes.func,
    setLinkUrl: PropTypes.func,
    setProviderId: PropTypes.func,
  }),
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default injectIntl(NonCounterUploadInnerForm);
