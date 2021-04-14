import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';

import DeleteStatistics from './DeleteStatistics';

function DeleteStatisticsModal({
  handlers,
  isStatsLoading,
  maxFailedAttempts,
  onCloseModal,
  open,
  providerId,
  stripes,
  counterReports,
  udpLabel
}) {
  const [reportsToDelete, setReportsToDelete] = useState(new Set());

  const addToReportsToDelete = (id) => {
    setReportsToDelete(oldReps => new Set(oldReps.add(id)));
  };

  const removeFromReportsToDelete = (id) => {
    setReportsToDelete(prev => new Set([...prev].filter(x => x !== id)));
  };

  return (
    <Modal
      id="delete-reports-modal"
      closeOnBackgroundClick
      data-test-delete-reports-modal
      // open={this.state.showDeleteReports}
      open={open}
      label="DELETE MULTIPLE REPORTS"
      footer={
        <ModalFooter>
          <Button
            buttonStyle="primary"
            disabled={reportsToDelete.size === 0}
            id="delete-multi-reports-button"
            onClick={() => console.log(`WILL SAVE ${reportsToDelete}`)}
          >
            SAVE
          </Button>
          <Button
            id="close-delete-multi-reports-button"
            // onClick={this.doCloseDeleteReports}
            onClick={onCloseModal}
          >
            CLOSE
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
  );
}

DeleteStatisticsModal.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  maxFailedAttempts: PropTypes.number.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  open: PropTypes.bool,
  providerId: PropTypes.string.isRequired,
  stripes: PropTypes.object.isRequired,
  counterReports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default DeleteStatisticsModal;
