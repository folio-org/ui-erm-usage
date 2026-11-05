import PropTypes from 'prop-types';

import { useOkapiKyMutation } from '@folio/stripes-leipzig-components';

import {
  API_CUSTOM_REPORTS,
  QK_CUSTOM_REPORTS,
} from '../../../util/constants';
import NonCounterUploadModal from './NonCounterUploadModal';

function NonCounterUpload({
  onFail,
  onClose,
  onSuccess,
  open,
  stripes,
  udpId,
}) {
  const { useCreate } = useOkapiKyMutation({
    mutationKey: QK_CUSTOM_REPORTS,
    api: API_CUSTOM_REPORTS,
  });
  const { mutateAsync: createCustomReport } = useCreate();

  const handleNonCounterUpload = (report) => {
    createCustomReport(report)
      .then(() => onSuccess())
      // HTTP errors only show the response text of the backend; other errors show their message
      .catch(async (err) => onFail(err.response ? await err.response.text() : err.message));
  };

  return (
    <NonCounterUploadModal
      onClose={onClose}
      onSubmit={handleNonCounterUpload}
      open={open}
      stripes={stripes}
      udpId={udpId}
    />
  );
}

NonCounterUpload.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default NonCounterUpload;
