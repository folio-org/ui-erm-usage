import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stripesFinalForm from '@folio/stripes/final-form';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';
import CounterUpload from './CounterUpload';

function CounterUploadModal(props) {
  const { invalid, onClose } = props;

  const footer = (onSubmit) => (
    <ModalFooter>
      <Button buttonStyle="primary" disabled={invalid} onClick={onSubmit}>
        Save
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  );

  return (
    <form
      data-test-counter-report-form-page
      id="form-counter-report"
      onSubmit={props.handleSubmit}
    >
      <Modal
        closeOnBackgroundClick
        footer={footer(props.handleSubmit)}
        open={props.open}
        label={
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload" />
        }
      >
        <div className="upload-counter-modal">
          <CounterUpload
            mutators={props.form.mutators}
            onFail={props.onFail}
            onSuccess={props.onSuccess}
            udpId={props.udpId}
            stripes={props.stripes}
          />
        </div>
      </Modal>
    </form>
  );
}

CounterUploadModal.propTypes = {
  form: PropTypes.shape({
    mutators: PropTypes.shape({}),
  }),
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default stripesFinalForm({
  mutators: {},
})(CounterUploadModal);
