import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Loading, Modal } from '@folio/stripes/components';

import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';
import CounterUploadModal from './CounterUploadModal';

function CounterUpload({ onClose, onFail, onSuccess, open, stripes: { okapi }, udpId }) {
  const [formState, setFormState] = useState({});
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

  useEffect(() => {
    const { values, form, overwrite } = formState;

    const doUpload = () => {
      openInfoModal(CounterUpload.upload);

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
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => { // NOSONAR
              throw new Error(text);
            });
          } else {
            return response;
          }
        })
        .then(() => {
          onSuccess(intl.formatMessage({ id: 'ui-erm-usage.report.upload.completed' }));
          closeInfoModal();
          form.reset();
        })
        .catch((err) => {
          showErrorInfo(err.message);
        });
    };

    if (values && form) {
      doUpload();
    }
  }, [formState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values, form) => {
    setFormState({ values, form });
  };

  const renderInfo = () => {
    if (infoType === CounterUpload.overwrite) {
      return (
        <>
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button id="overwriteYes" onClick={() => setFormState({ ...formState, overwrite: true })}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button id="overwriteNo" onClick={closeInfoModal}>
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
      <CounterUploadModal open={open} onClose={onClose} onSubmit={handleSubmit} />
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
