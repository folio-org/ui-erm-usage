import PropTypes from 'prop-types';
import NonCounterUploadModal from './NonCounterUploadModal';
import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';

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
      open={open}
      onClose={onClose}
      onSubmit={handleNonCounterUpload}
      stripes={stripes}
      udpId={udpId}
    />
  );
}

NonCounterUpload.propTypes = {
  // handlers: PropTypes.shape(),
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default NonCounterUpload;
