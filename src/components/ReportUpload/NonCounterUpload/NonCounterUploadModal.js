import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import { Button, Modal, ModalFooter } from '@folio/stripes/components';

import NonCounterInnerForm from './NonCounterInnerForm';
import { isValidUrl } from '../../../util/validate';

function NonCounterUploadModal(props) {
  const { invalid, onClose } = props;

  const renderFooter = (onSubmit) => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        disabled={invalid}
        id="save-non-counter-button"
        onClick={onSubmit}
      >
        <FormattedMessage id="ui-erm-usage.general.save" />
      </Button>
      <Button onClick={onClose}>
        <FormattedMessage id="ui-erm-usage.general.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <form
      data-test-custom-report-form-page
      id="form-custom-report"
      onSubmit={props.handleSubmit}
    >
      <Modal
        id="upload-non-counter-modal"
        closeOnBackgroundClick
        footer={renderFooter(props.handleSubmit)}
        open={props.open}
        label={
          <FormattedMessage id="ui-erm-usage.statistics.custom.upload" />
          }
      >
        <div className="upload-non-counter-modal">
          <NonCounterInnerForm
            mutators={props.form.mutators}
            udpId={props.udpId}
            stripes={props.stripes}
          />
        </div>
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
  invalid: PropTypes.bool.isRequired,
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
    setLinkUrl: (args, state, tools) => {
      tools.changeValue(state, 'linkUrl', () => args[1]);
    },
  },
  subscription: {
    values: true,
    invalid: true,
  },
  validate: (values) => {
    const errors = {};
    const yyyyRegex = /^[12]\d{3}$/;
    if (!values.fileId && !values.linkUrl) {
      errors.fileId = 'Required';
      errors.linkUrl = 'Required';
    } else if (values.linkUrl && !isValidUrl(values.linkUrl)) {
      errors.linkUrl = 'Invalid format';
    }
    if (!values.year) {
      errors.year = 'Required';
    } else if (!yyyyRegex.test(values.year)) {
      errors.year = 'Invalid format';
    }
    return errors;
  },
})(NonCounterUploadModal);
