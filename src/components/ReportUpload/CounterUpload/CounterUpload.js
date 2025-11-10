import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Loading, Modal, ModalFooter } from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';
import CounterUploadModal from './CounterUploadModal';
import {
  ERROR_CODES
} from '../../../util/constants';

function CounterUpload({ onClose, onSuccess, open, stripes: { okapi }, udpId }) {
  const [formState, setFormState] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null, footer: null });

  const intl = useIntl();



  const handleSelectOtherFile = () => {
    setShowInfoModal(false);
    formState.form?.reset();
  };

  const handleCloseModalsAndReset = () => {
    onClose();
    handleSelectOtherFile();
  };

  const errorFooter = () => (
    <>
      <Button
        buttonStyle="primary"
        onClick={handleSelectOtherFile}
      >
        <FormattedMessage id="ui-erm-usage.report.upload.selectAnotherFile" />
      </Button>
      <Button onClick={handleCloseModalsAndReset}>
        <FormattedMessage id="ui-erm-usage.general.close" />
      </Button>
    </>
  );

  const labelModalUploadFailed = intl.formatMessage({ id: 'ui-erm-usage.report.upload.modal.label.failed' });
  const labelModalUpload = intl.formatMessage({ id: 'ui-erm-usage.report.upload.modal.label' });

  const showErrorInfo = (err = {}) => {
    // REPORTS_ALREADY_PRESENT
    if (err.code === 'REPORTS_ALREADY_PRESENT') {
      setModalContent({
        title: labelModalUpload,
        content: (
          <div>
            <p><FormattedMessage id="ui-erm-usage.report.upload.reportExists" /></p>
          </div>
        ),
        footer: (
          <>
            <Button buttonStyle="primary" id="overwriteYes" onClick={() => setFormState({ ...formState, overwrite: true })}>
              <FormattedMessage id="ui-erm-usage.general.yes" />
            </Button>
            <Button id="overwriteNo" onClick={handleSelectOtherFile}>
              <FormattedMessage id="ui-erm-usage.general.no" />
            </Button>
          </>
        ),
      });
    // All ERRORS with CODES
    } else if (err.code && ERROR_CODES.includes(err.code)) {
      setModalContent({
        title: labelModalUploadFailed,
        content: (
          <div>
            <p>{intl.formatMessage({ id: `ui-erm-usage.counter.upload.error.${err.code}` })}</p>
            {(err.code === 'UNSUPPORTED_FILE_FORMAT') &&
              <p>{intl.formatMessage({ id: `ui-erm-usage.counter.upload.error.${err.code}.detail` })}</p>
            }
            <details>
              <summary><b>{intl.formatMessage({ id: 'ui-erm-usage.general.moreInformation' })}</b></summary>
              <p>{err?.details}</p>
            </details>
          </div>
        ),
        footer: errorFooter(),
      });
    // All other ERRORS (without CODES)
    } else {
      setModalContent({
        title: labelModalUploadFailed,
        content: (
          <div>
            <p><FormattedMessage id="ui-erm-usage.general.error" /></p>
            {err &&
              <details>
                <summary><b>{intl.formatMessage({ id: 'ui-erm-usage.general.moreInformation' })}</b></summary>
                <p>{err?.message || JSON.stringify(err)}</p>
              </details>
            }
          </div>
        ),
        footer: errorFooter(),
      });
    }

    setShowInfoModal(true);
  };

  const handleUploadResponse = (response, form) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        throw errorData;
      });
    }

    onSuccess(intl.formatMessage({ id: 'ui-erm-usage.report.upload.completed' }));
    setShowInfoModal(false);
    form.reset();
    return response;
  };

  useEffect(() => {
    const { values, form, overwrite } = formState;

    const doUpload = () => {
      setModalContent({
        title: labelModalUpload,
        content: (
          <div>
            <p><FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" /></p>
            <Loading />
          </div>
        ),
        footer: null,
      });
      setShowInfoModal(true);

      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('reportEditedManually', values.reportEditedManually);
      formData.append('editReason', values.editReason);
      fetchWithDefaultOptions(
        okapi,
        `/counter-reports/multipartupload/provider/${udpId}?overwrite=${overwrite || false}`,
        {
          method: 'POST',
          body: formData,
        }
      )
        .then((response) => handleUploadResponse(response, form))
        .catch((err) => {
          showErrorInfo(err);
        });
    };

    if (values && form) {
      doUpload();
    }
  }, [formState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values, form) => {
    setFormState({ values, form });
  };

  return (
    <>
      <CounterUploadModal open={open} onClose={onClose} onSubmit={handleSubmit} />
      <Modal
        open={showInfoModal}
        label={modalContent.title}
        footer={<ModalFooter>{modalContent.footer}</ModalFooter>}
      >
        {showInfoModal && modalContent.content}
      </Modal>
    </>
  );
}

CounterUpload.propTypes = {
  onSuccess: PropTypes.func,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default CounterUpload;
