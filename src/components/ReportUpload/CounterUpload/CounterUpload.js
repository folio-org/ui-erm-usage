import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Loading, Modal } from '@folio/stripes/components';

import CounterUploadModal from './CounterUploadModal';
import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';

function CounterUpload({ onClose, onFail, onSuccess, open, stripes: { okapi }, udpId }) {
  const [values, setValues] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');
  const intl = useIntl();

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoType('');
  };

  const openInfoModal = (type) => {
    setShowInfoModal(true);
    setInfoType(type);
  };

  const showErrorInfo = (msg) => {
    if (msg.includes('Report already existing')) {
      openInfoModal(CounterUpload.overwrite);
    } else {
      closeInfoModal();
      onFail(msg);
    }
  };

  const doUpload = (formValues, doOverwrite) => {
    setValues(formValues);
    openInfoModal(CounterUpload.upload);

    const formData = new FormData();
    formData.append('file', formValues.file);
    formData.append('reportEditedManually', formValues.reportEditedManually);
    formData.append('editReason', formValues.editReason);
    fetchWithDefaultOptions(
      okapi,
      `/counter-reports/multipartupload/provider/${udpId}?overwrite=${doOverwrite}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          onSuccess(intl.formatMessage({ id: 'ui-erm-usage.report.upload.completed' }));
          closeInfoModal();
          return response;
        }
      })
      .catch((err) => {
        showErrorInfo(err.message);
      });
  };

  const uploadFile = (formValues) => {
    return doUpload(formValues, false);
  };

  const uploadFileForceOverwrite = () => {
    return doUpload(values, true);
  };

  const cancelUpload = () => {
    closeInfoModal();
  };

  const renderInfo = () => {
    if (infoType === CounterUpload.overwrite) {
      return (
        <>
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button id="overwriteYes" onClick={uploadFileForceOverwrite}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button id="overwriteNo" onClick={cancelUpload}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    } else if (infoType === CounterUpload.upload) {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" />
          <Loading />
        </>
      );
    } else {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.general.error" />
          <Button onClick={closeInfoModal}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <CounterUploadModal open={open} onClose={onClose} onSubmit={uploadFile} />
      <Modal
        open={showInfoModal}
        label={intl.formatMessage({
          id: 'ui-erm-usage.report.upload.modal.label',
        })}
      >
        {showInfoModal && renderInfo()}
      </Modal>
    </>
  );
}

CounterUpload.upload = 'upload';
CounterUpload.overwrite = 'overwrite';

CounterUpload.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default CounterUpload;
