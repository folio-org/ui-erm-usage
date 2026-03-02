import PropTypes from 'prop-types';

import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';
import NonCounterUploadModal from './NonCounterUploadModal';

function NonCounterUpload({
  onFail,
  onClose,
  onSuccess,
  open,
  stripes,
  udpId,
}) {
  const handleNonCounterUpload = (report) => {
    const json = JSON.stringify(report);
    fetchWithDefaultOptions(stripes.okapi, '/custom-reports', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: json,
    })
      .then((response) => {
        if (response.status >= 400) {
          response.text().then((t) => onFail(t));
        } else {
          onSuccess();
        }
      })
      .catch((err) => {
        onFail(err.message);
      });
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
