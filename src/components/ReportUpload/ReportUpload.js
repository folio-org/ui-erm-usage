import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Callout,
} from '@folio/stripes-components';

import CounterUploadModal from './CounterUploadModal';
import NonCounterUploadModal from './NonCounterUploadModal';

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

  const handleNonCounterUpload = (report) => {
    const json = JSON.stringify(report);
    const { stripes } = props;
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
          handleFail();
        } else {
          handleSuccess();
        }
      })
      .catch((err) => {
        const failText = this.props.intl.formatMessage({
          id: 'ui-erm-usage.report.upload.failed',
        });
        const infoText = failText + ' ' + err.message;
        handleFail();
      });
  };
  return (
    <>
      <Button onClick={() => setShowCounterUpload(true)}>
        Upload COUNTER FILE
      </Button>
      <Button onClick={() => setShowNonCounterUpload(true)}>
        Upload Non-COUNTER FILE
      </Button>
      <CounterUploadModal
        open={showCounterUpload}
        onClose={() => setShowCounterUpload(false)}
        onFail={handleFail}
        onSuccess={handleSuccess}
        stripes={props.stripes}
        udpId={props.udpId}
      />
      <NonCounterUploadModal
        open={showNonCounterUpload}
        onClose={() => setShowNonCounterUpload(false)}
        onFail={handleFail}
        onSubmit={handleNonCounterUpload}
        onSuccess={handleSuccess}
        stripes={props.stripes}
        udpId={props.udpId}
      />
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
