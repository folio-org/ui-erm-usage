import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';
import CounterUpload from './CounterUpload';

function CounterUploadModal(props) {
  const footer = (
    <ModalFooter>
      <Button onClick={props.onClose}>Cancel</Button>
    </ModalFooter>
  );

  return (
    <Modal
      closeOnBackgroundClick
      footer={footer}
      open={props.open}
      label="UPLOAD REPORT"
    >
      <div className="upload-counter-modal">
        <CounterUpload
          onFail={props.onFail}
          onSuccess={props.onSuccess}
          udpId={props.udpId}
          stripes={props.stripes}
        />
      </div>
    </Modal>
  );
}

CounterUploadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default CounterUploadModal;
