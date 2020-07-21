import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { stripesConnect } from '@folio/stripes-core';
import {
  Button,
  ConfirmationModal,
  IconButton,
  Modal,
} from '@folio/stripes-components';

import CustomReportInfo from '../CustomReportInfo';

function InfoButton(props) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { customReport } = props;

  const httpHeaders = Object.assign(
    {},
    {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    }
  );

  const doDelete = () => {
    fetch(`${props.stripes.okapi.url}/erm-usage/files/${customReport.fileId}`, {
      method: 'DELETE',
      headers: httpHeaders,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({
            identifier: `Error ${response.status} deleting file`,
            _error: 'Fetch file failed',
          });
        } else {
          props.mutator.customReport
            .DELETE({ id: customReport.id })
            .then(() => {});
        }
      })
      .catch((err) => {
        throw new Error('Error while deleting custom report. ' + err.message);
      });
    setShowConfirmDelete(false);
  };

  const handleDelete = () => {
    setShowModal(false);
    setShowConfirmDelete(true);
  };

  const ariaLabel = `Open report info for custom report ${customReport.year} ${customReport.note}.`;
  const footer = (
    <Button id="close-report-info-button" onClick={() => setShowModal(false)}>
      Close
    </Button>
  );
  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        icon="info"
        id={`custom-report-button-${customReport.id}`}
        onClick={() => setShowModal(!showModal)}
      />
      <Modal
        id={`custom-report-info-${customReport.id}`}
        closeOnBackgroundClick
        open={showModal}
        label="Customreport info"
        footer={footer}
      >
        <div id="custom-report-info" className="custom-report-info">
          <CustomReportInfo
            stripes={props.stripes}
            customReport={customReport}
            onDelete={handleDelete}
            udpLabel={props.udpLabel}
          />
        </div>
      </Modal>
      <ConfirmationModal
        open={showConfirmDelete}
        heading="CONFIRM DELETE"
        message="Do you really want to delete this report?"
        onConfirm={doDelete}
        confirmLabel="YES"
        onCancel={() => setShowConfirmDelete(false)}
        cancelLabel="NO"
      />
    </>
  );
}

InfoButton.manifest = Object.freeze({
  customReport: {
    type: 'okapi',
    fetch: false,
    DELETE: {
      path: 'custom-reports',
    },
  },
});

InfoButton.propTypes = {
  mutator: PropTypes.shape({
    customReport: PropTypes.object,
  }),
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
  customReport: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default stripesConnect(InfoButton);
