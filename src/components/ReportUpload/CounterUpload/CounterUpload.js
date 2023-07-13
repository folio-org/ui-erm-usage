import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Loading, Modal } from '@folio/stripes/components';

import CounterUploadModal from './CounterUploadModal';
import getLegacyTokenHeader from '../../../util/getLegacyTokenHeader';

function CounterUpload({
  intl,
  onClose,
  onFail,
  onSuccess,
  open,
  stripes,
  udpId,
}) {
  const okapiUrl = stripes.okapi.url;
  const httpHeaders = Object.assign(
    {},
    {
      'X-Okapi-Tenant': stripes.okapi.tenant,
      ...getLegacyTokenHeader(stripes.okapi),
      'Content-Type': 'application/json',
      credentials: 'include',
    }
  );

  const [selectedFile, setSelectedFile] = useState({});
  const [values, setValues] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoType('');
  };

  const showErrorInfo = (response) => {
    response.text().then((text) => {
      if (text.includes('Report already existing')) {
        setShowInfoModal(true);
        setInfoType(CounterUpload.overwrite);
      } else {
        closeInfoModal();
        onFail(text);
      }
    });
  };

  const doUpload = async (report, doOverwrite) => {
    setValues(report);
    const json = JSON.stringify(report);

    setShowInfoModal(true);
    setInfoType(CounterUpload.upload);
    fetch(
      `${okapiUrl}/counter-reports/upload/provider/${udpId}?overwrite=${doOverwrite}`,
      {
        headers: httpHeaders,
        method: 'POST',
        body: json,
      }
    )
      .then((response) => {
        if (response.status >= 400) {
          showErrorInfo(response);
          return Promise.resolve(true);
        } else {
          setShowInfoModal(false);
          setSelectedFile({});
          onSuccess(
            intl.formatMessage({
              id: 'ui-erm-usage.report.upload.completed',
            })
          );
          return Promise.resolve(true);
        }
      })
      .catch((err) => {
        closeInfoModal();
        onFail(err.message);
      });
  };

  const uploadFile = (report) => {
    return doUpload(report, false);
  };

  const uploadFileForceOverwrite = () => {
    return doUpload(values, true);
  };

  const cancleUpload = () => {
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
          <Button id="overwriteNo" onClick={cancleUpload}>
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
      <CounterUploadModal
        open={open}
        onClose={onClose}
        onSubmit={uploadFile}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <Modal
        open={showInfoModal}
        label={intl.formatMessage({
          id: 'ui-erm-usage.report.upload.modal.label',
        })}
        id="counterReportExists"
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
  intl: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  mutators: PropTypes.shape({
    setContent: PropTypes.func,
  }),
};

export default injectIntl(CounterUpload);
