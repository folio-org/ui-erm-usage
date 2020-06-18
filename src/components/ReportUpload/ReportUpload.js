import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Callout,
  ConfirmationModal,
  Modal,
} from '@folio/stripes-components';

import CounterUpload from './CounterUpload';
import NonCounterUpload from './NonCounterUpload';

function ReportUpload(props) {
  const [showCounterUpload, setShowCounterUpload] = useState(false);
  const [showNonCounterUpload, setShowNonCounterUpload] = useState(false);
  let callout = React.createRef();

  const handleSuccess = () => {
    callout.sendCallout({
      message: 'SUCCESS UPLOAD REPORT',
    });
    setShowCounterUpload(false);
    setShowNonCounterUpload(false);
  };

  const handleFail = () => {
    callout.sendCallout({
      type: 'error',
      message: 'FAIL UPLOAD REPORT',
      timeout: 0,
    });
    setShowCounterUpload(false);
    setShowNonCounterUpload(false);
  };

  const renderChild = () => {
    if (showCounterUpload) {
      return (
        <CounterUpload
          onFail={handleFail}
          onSuccess={handleSuccess}
          udpId={props.udpId}
          stripes={props.stripes}
        />
      );
    } else if (showNonCounterUpload) {
      return (
        <NonCounterUpload
          onFail={handleFail}
          onSuccess={handleSuccess}
          udpId={props.udpId}
          stripes={props.stripes}
        />
      );
    } else {
      return <div>FAIL</div>;
    }
  };

  const closeModalButton = () => {
    return (
      <Button
        onClick={() => {
          setShowCounterUpload(false);
          setShowNonCounterUpload(false);
        }}
      >
        Close
      </Button>
    );
  };

  return (
    <>
      <Button onClick={() => setShowCounterUpload(true)}>
        Upload COUNTER FILE
      </Button>
      <Button onClick={() => setShowNonCounterUpload(true)}>
        Upload Non-COUNTER FILE
      </Button>
      <Modal
        closeOnBackgroundClick
        footer={closeModalButton()}
        open={showCounterUpload || showNonCounterUpload}
        label="UPLOAD REPORT"
      >
        {renderChild()}
      </Modal>
      <Callout
        ref={(ref) => {
          callout = ref;
        }}
      />
    </>
  );
}

ReportUpload.propTypes = {
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default ReportUpload;
