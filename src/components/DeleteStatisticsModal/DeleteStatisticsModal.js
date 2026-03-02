import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  ConfirmationModal,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

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
    })
      .then((res) => {
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
      })
      .catch(() => {
        onFail(
          intl.formatMessage({
            id: 'ui-erm-usage.statistics.multi.delete.fail',
          })
        );
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
        closeOnBackgroundClick
        data-test-delete-reports-modal
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
        id="delete-reports-modal"
        label={
          <FormattedMessage id="ui-erm-usage.statistics.multi.delete.header" />
        }
        open={open}
      >
        <DeleteStatistics
          addToReportsToDelete={addToReportsToDelete}
          counterReports={counterReports}
          handlers={handlers}
          isStatsLoading={isStatsLoading}
          maxFailedAttempts={maxFailedAttempts}
          providerId={providerId}
          removeFromReportsToDelete={removeFromReportsToDelete}
          reportsToDelete={reportsToDelete}
          stripes={stripes}
          udpLabel={udpLabel}
        />
      </Modal>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.delete',
        })}
        heading={
          <FormattedMessage id="ui-erm-usage.statistics.multi.delete.header.question" />
        }
        id="delete-multi-statistics-confirmation"
        message={
          <FormattedMessage
            id="ui-erm-usage.statistics.multi.delete.confirmation"
            values={{
              count: reportsToDelete.size,
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
        onCancel={() => {
          setShowConfirmDelete(false);
        }}
        onConfirm={handleSubmit}
        open={showConfirmDelete}
      />
      <ConfirmationModal
        cancelLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.closeWithoutSave',
        })}
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.keepEditing',
        })}
        heading={<FormattedMessage id="ui-erm-usage.general.sure" />}
        id="close-delete-multi-statistics-confirmation"
        message={
          <FormattedMessage id="ui-erm-usage.general.unsaved.selections" />
        }
        onCancel={() => {
          setShowCloseModal(false);
          onCloseModal();
        }}
        onConfirm={() => setShowCloseModal(false)}
        open={showCloseModal}
      />
    </>
  );
}

DeleteStatisticsModal.propTypes = {
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  udpLabel: PropTypes.string.isRequired,
};

export default injectIntl(DeleteStatisticsModal);
