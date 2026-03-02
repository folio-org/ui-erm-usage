import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ConfirmationModal,
  IconButton,
  Modal,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import fetchWithDefaultOptions from '../../../util/fetchWithDefaultOptions';
import CustomReportInfo from '../CustomReportInfo';

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
          throw new Error(`Error ${response.status} deleting file: Fetch file failed`);
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
        data-testid={`custom-report-button-${customReport.id}`}
        icon="info"
        id={`custom-report-button-${customReport.id}`}
        onClick={() => setShowModal(!showModal)}
      />
      <Modal
        closeOnBackgroundClick
        footer={footer}
        id={`custom-report-info-${customReport.id}`}
        label={<FormattedMessage id="ui-erm-usage.statistics.custom.info" />}
        open={showModal}
      >
        <div className="custom-report-info" id="custom-report-info">
          <CustomReportInfo
            customReport={customReport}
            handlers={props.handlers}
            onDelete={handleDelete}
            stripes={props.stripes}
            udpLabel={props.udpLabel}
          />
        </div>
      </Modal>
      <ConfirmationModal
        cancelLabel={<FormattedMessage id="ui-erm-usage.general.no" />}
        confirmLabel={<FormattedMessage id="ui-erm-usage.general.yes" />}
        heading={<FormattedMessage id="ui-erm-usage.reportOverview.confirmDeleteReport" />}
        message={deleteConfirmMsg}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={doDelete}
        open={showConfirmDelete}
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
  customReport: PropTypes.shape().isRequired,
  handlers: PropTypes.shape(),
  mutator: PropTypes.shape({
    customReport: PropTypes.object,
  }),
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default stripesConnect(InfoButton);
