import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalFooter } from '@folio/stripes-components';

import DeleteStatistics from './DeleteStatistics';

function DeleteStatisticsModal({
  data,
  handlers,
  isStatsLoading,
  onCloseModal,
  open,
  providerId,
  stripes,
  counterReportsPerYear,
}) {
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
            // disabled={invalid}
            id="save-non-counter-button"
            onClick={() => console.log('SAVE')}
          >
            SAVE
          </Button>
          <Button
            id="close-delete-reports-button"
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
        counterReports={data.counterReports}
        customReports={data.customReports}
        isStatsLoading={isStatsLoading}
        handlers={handlers}
        counterReportsPerYear={counterReportsPerYear}
      />
    </Modal>
  );
}

DeleteStatisticsModal.propTypes = {
  data: PropTypes.shape({
    counterReports: PropTypes.arrayOf(PropTypes.shape()),
    customReports: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  open: PropTypes.bool,
  providerId: PropTypes.string.isRequired,
  stripes: PropTypes.object.isRequired,
  counterReportsPerYear: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default DeleteStatisticsModal;
