import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Callout } from '@folio/stripes-components';

import CounterUploadModal from './CounterUploadModal';
import NonCounterUploadModal from './NonCounterUploadModal';

function ReportUpload(props) {
  const { intl } = props;
  const [showCounterUpload, setShowCounterUpload] = useState(false);
  const [showNonCounterUpload, setShowNonCounterUpload] = useState(false);
  let callout = React.createRef();

  const handleSuccess = () => {
    const info = intl.formatMessage({
      id: 'ui-erm-usage.report.upload.success',
    });
    callout.sendCallout({
      message: info,
    });
    setShowCounterUpload(false);
    setShowNonCounterUpload(false);
  };

  const handleFail = (msg) => {
    const failText = intl.formatMessage({
      id: 'ui-erm-usage.report.upload.failed',
    });
    callout.sendCallout({
      type: 'error',
      message: `${failText} ${msg}`,
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
        handleFail(err.message);
      });
  };
  return (
    <>
      <Button
        id="upload-counter-button"
        onClick={() => setShowCounterUpload(true)}
      >
        Upload COUNTER FILE
      </Button>
      <Button
        id="upload-non-counter-button"
        onClick={() => setShowNonCounterUpload(true)}
      >
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
  intl: PropTypes.object,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default injectIntl(ReportUpload);
