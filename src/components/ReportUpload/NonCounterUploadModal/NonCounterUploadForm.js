import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stripesFinalForm from '@folio/stripes/final-form';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';
import NonCounterUploadModal from './NonCounterUploadModal';

function NonCounterUploadForm(props) {
  const {
    handlers,
    invalid,
    onFail,
    onClose,
    onSuccess,
    open,
    stripes,
    udpId,
  } = props;

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
      handlers={handlers}
    />
  );
}

NonCounterUploadModal.propTypes = {
  handlers: PropTypes.shape(),
  invalid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default NonCounterUploadForm;
