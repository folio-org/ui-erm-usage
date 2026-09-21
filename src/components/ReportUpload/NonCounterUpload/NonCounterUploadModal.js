import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  composeValidators,
  isValidUrl,
  required,
  year,
} from '../../../util/validate';
import NonCounterInnerForm from './NonCounterInnerForm';

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
      id="form-custom-report"
      onSubmit={props.handleSubmit}
    >
      <Modal
        closeOnBackgroundClick
        footer={renderFooter(props.handleSubmit)}
        id="upload-non-counter-modal"
        label={<FormattedMessage id="ui-erm-usage.statistics.custom.upload" />}
        open={props.open}
      >
        <div className="upload-non-counter-modal">
          <NonCounterInnerForm
            mutators={props.form.mutators}
            stripes={props.stripes}
            udpId={props.udpId}
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
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
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

    if (!values.fileId && !values.linkUrl) {
      errors.fileId = true;
      errors.linkUrl = true;
    } else if (values.linkUrl && !isValidUrl(values.linkUrl)) {
      errors.linkUrl = true;
    }

    errors.year = composeValidators(required, year)(values.year);

    return errors;
  },
})(NonCounterUploadModal);
