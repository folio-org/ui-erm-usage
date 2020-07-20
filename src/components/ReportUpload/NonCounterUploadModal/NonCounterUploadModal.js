import React from 'react';
import PropTypes from 'prop-types';
import stripesFinalForm from '@folio/stripes/final-form';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';
import NonCounterUpload from './NonCounterUpload';

function NonCounterUploadModal(props) {
  const { onClose } = props;
  const renderFooter = (onSubmit) => (
    <ModalFooter>
      <Button buttonStyle="primary" onClick={onSubmit}>
        Save
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  );

  return (
    <form
      data-test-custom-report-form-page
      id="form-custom-report"
      onSubmit={props.handleSubmit}
    >
      <Modal
        closeOnBackgroundClick
        footer={renderFooter(props.handleSubmit)}
        open={props.open}
        label="UPLOAD REPORT"
      >
        <NonCounterUpload
          mutators={props.form.mutators}
          udpId={props.udpId}
          stripes={props.stripes}
        />
      </Modal>
    </form>
  );
}

NonCounterUploadModal.propTypes = {
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setFileId: PropTypes.func,
      setFileName: PropTypes.func,
      setFileSize: PropTypes.func,
      setProviderId: PropTypes.func,
    }),
  }),
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default stripesFinalForm({
  navigationCheck: true,
  mutators: {
    setFileId: (args, state, tools) => {
      tools.changeValue(state, 'fileId', () => args[1]);
    },
    setFileName: (args, state, tools) => {
      tools.changeValue(state, 'fileName', () => args[1]);
    },
    setFileSize: (args, state, tools) => {
      tools.changeValue(state, 'fileSize', () => args[1]);
    },
    setProviderId: (args, state, tools) => {
      tools.changeValue(state, 'providerId', () => args[1]);
    },
  },
})(NonCounterUploadModal);
