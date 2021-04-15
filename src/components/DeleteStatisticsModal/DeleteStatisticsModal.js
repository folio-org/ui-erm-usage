import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import {
  Button,
  ConfirmationModal,
  Modal,
  ModalFooter,
} from '@folio/stripes-components';

import DeleteStatistics from './DeleteStatistics';

function DeleteStatisticsModal({
  handlers,
  intl,
  isStatsLoading,
  maxFailedAttempts,
  onCloseModal,
  onFail,
  onSuccess,
  open,
  providerId,
  stripes,
  counterReports,
  udpLabel,
}) {
  const [reportsToDelete, setReportsToDelete] = useState(new Set());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const addToReportsToDelete = (id) => {
    setReportsToDelete((oldReps) => new Set(oldReps.add(id)));
  };

  const removeFromReportsToDelete = (id) => {
    setReportsToDelete((prev) => new Set([...prev].filter((x) => x !== id)));
  };
  const ky = useOkapiKy();
  const handleSubmit = () => {
    const idArray = JSON.stringify([...reportsToDelete]);
    ky('counter-reports/reports/delete', {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-type': 'application/json',
      },
      body: idArray,
    }).then((res) => {
      setShowConfirmDelete(false);
      if (res.ok) {
        setReportsToDelete(new Set());
        const msg = intl.formatMessage(
          {
            id: 'ui-erm-usage.statistics.multi.delete.success',
          },
          {
            count: reportsToDelete.size,
          }
        );
        onSuccess(msg);
      } else {
        onFail(
          intl.formatMessage({
            id: 'ui-erm-usage.statistics.multi.delete.fail',
          })
        );
      }
    });
  };

  const handleCloseModal = () => {
    if (reportsToDelete.size > 0) {
      setShowCloseModal(true);
    } else {
      setShowCloseModal(false);
      onCloseModal();
    }
  };

  return (
    <>
      <Modal
        id="delete-reports-modal"
        closeOnBackgroundClick
        data-test-delete-reports-modal
        open={open}
        label={
          <FormattedMessage id="ui-erm-usage.statistics.multi.delete.header" />
        }
        footer={
          <ModalFooter>
            <Button
              buttonStyle="danger"
              disabled={reportsToDelete.size === 0}
              id="delete-multi-reports-button"
              onClick={() => setShowConfirmDelete(true)}
            >
              <FormattedMessage
                id="ui-erm-usage.statistics.multi.delete.submit"
                values={{
                  count: reportsToDelete.size,
                }}
              />
            </Button>
            <Button
              id="close-delete-multi-reports-button"
              onClick={handleCloseModal}
            >
              <FormattedMessage id="ui-erm-usage.general.cancel" />
            </Button>
          </ModalFooter>
        }
      >
        <DeleteStatistics
          stripes={stripes}
          providerId={providerId}
          isStatsLoading={isStatsLoading}
          handlers={handlers}
          counterReports={counterReports}
          reportsToDelete={reportsToDelete}
          addToReportsToDelete={addToReportsToDelete}
          removeFromReportsToDelete={removeFromReportsToDelete}
          udpLabel={udpLabel}
          maxFailedAttempts={maxFailedAttempts}
        />
      </Modal>
      <ConfirmationModal
        id="delete-multi-statistics-confirmation"
        open={showConfirmDelete}
        heading={
          <FormattedMessage id="ui-erm-usage.statistics.multi.delete.header.question" />
        }
        message={
          <FormattedMessage
            id="ui-erm-usage.statistics.multi.delete.confirmation"
            values={{
              count: reportsToDelete.size,
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
        onConfirm={handleSubmit}
        onCancel={() => {
          setShowConfirmDelete(false);
        }}
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.delete',
        })}
        buttonStyle="danger"
      />
      <ConfirmationModal
        id="close-delete-multi-statistics-confirmation"
        open={showCloseModal}
        heading={<FormattedMessage id="ui-erm-usage.general.sure" />}
        message={
          <FormattedMessage id="ui-erm-usage.general.unsaved.selections" />
        }
        onCancel={() => {
          setShowCloseModal(false);
          onCloseModal();
        }}
        onConfirm={() => setShowCloseModal(false)}
        cancelLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.closeWithoutSave',
        })}
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.keepEditing',
        })}
      />
    </>
  );
}

DeleteStatisticsModal.propTypes = {
  handlers: PropTypes.shape({}).isRequired,
  intl: PropTypes.object,
  isStatsLoading: PropTypes.bool.isRequired,
  maxFailedAttempts: PropTypes.number.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  open: PropTypes.bool,
  providerId: PropTypes.string.isRequired,
  stripes: PropTypes.object.isRequired,
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default injectIntl(DeleteStatisticsModal);
