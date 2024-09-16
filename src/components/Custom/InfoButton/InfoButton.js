import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useState } from 'react';
import { SubmissionError } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  ConfirmationModal,
  IconButton,
  Modal,
} from '@folio/stripes/components';

import CustomReportInfo from '../CustomReportInfo';
import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';

function InfoButton(props) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const {
    customReport,
    stripes: { okapi },
  } = props;

  const doDeleteReport = () => {
    props.mutator.customReport.DELETE({ id: customReport.id }).then(() => {});
  };

  const doDeleteWithFile = () => {
    fetchWithDefaultOptions(okapi, `/erm-usage/files/${customReport.fileId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({
            identifier: `Error ${response.status} deleting file`,
            _error: 'Fetch file failed',
          });
        } else {
          doDeleteReport();
        }
      })
      .catch((err) => {
        throw new Error('Error while deleting custom report. ' + err.message);
      });
  };

  const doDelete = () => {
    if (!isNil(customReport.fileId)) {
      doDeleteWithFile();
    } else {
      doDeleteReport();
    }
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

  const deleteConfirmMsg = (
    <FormattedMessage
      id="ui-erm-usage.reportOverview.deleteTemplateMessage"
      values={{
        name: <strong>{`${customReport.year} - ${customReport.note}`}</strong>,
      }}
    />
  );

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        icon="info"
        id={`custom-report-button-${customReport.id}`}
        data-testid={`custom-report-button-${customReport.id}`}
        onClick={() => setShowModal(!showModal)}
      />
      <Modal
        id={`custom-report-info-${customReport.id}`}
        closeOnBackgroundClick
        open={showModal}
        label={<FormattedMessage id="ui-erm-usage.statistics.custom.info" />}
        footer={footer}
      >
        <div id="custom-report-info" className="custom-report-info">
          <CustomReportInfo
            stripes={props.stripes}
            customReport={customReport}
            onDelete={handleDelete}
            udpLabel={props.udpLabel}
            handlers={props.handlers}
          />
        </div>
      </Modal>
      <ConfirmationModal
        open={showConfirmDelete}
        heading={<FormattedMessage id="ui-erm-usage.reportOverview.confirmDelete" />}
        message={deleteConfirmMsg}
        onConfirm={doDelete}
        confirmLabel={<FormattedMessage id="ui-erm-usage.general.yes" />}
        onCancel={() => setShowConfirmDelete(false)}
        cancelLabel={<FormattedMessage id="ui-erm-usage.general.no" />}
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
  handlers: PropTypes.shape(),
};

export default stripesConnect(InfoButton);
