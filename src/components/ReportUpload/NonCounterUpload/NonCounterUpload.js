import React from 'react';
import PropTypes from 'prop-types';
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
    const okapiUrl = stripes.okapi.url;
    const httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        'X-Okapi-Token': stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      }
    );
    fetch(`${okapiUrl}/custom-reports`, {
      headers: httpHeaders,
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
