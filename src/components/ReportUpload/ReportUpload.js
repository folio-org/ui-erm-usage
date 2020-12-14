import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Callout } from '@folio/stripes-components';

import CounterUpload from './CounterUploadModal/CounterUpload';
import NonCounterUploadModal from './NonCounterUploadModal';

let callout;
let myreportid;

class ReportUpload extends React.Component {
  constructor(props) {
    super(props);
    // const { intl } = props;
    // const [showCounterUpload, setShowCounterUpload] = useState(false);
    // const [showNonCounterUpload, setShowNonCounterUpload] = useState(false);

    this.state = {
      showCounterUpload: false,
      showNonCounterUpload: false,
    };

    callout = React.createRef();
  }

  handleSuccess = () => {
    const info = this.props.intl.formatMessage({
      id: 'ui-erm-usage.report.upload.success',
    });
    // const info = 'ui-erm-usage.report.upload.success';
    callout.sendCallout({
      message: info,
    });
    this.setState({
      showCounterUpload: false,
      showNonCounterUpload: false,
    });
    // this.setShowCounterUpload(false);
    // this.setShowNonCounterUpload(false);
  };

  handleFail = (msg) => {
    const failText = this.props.intl.formatMessage({
      id: 'ui-erm-usage.report.upload.failed',
    });
    // const failText = 'ui-erm-usage.report.upload.failed';
    callout.sendCallout({
      type: 'error',
      message: `${failText} ${msg}`,
      timeout: 0,
    });
    this.setState({
      showCounterUpload: false,
      showNonCounterUpload: false,
    });
    // this.setShowCounterUpload(false);
    // this.setShowNonCounterUpload(false);
  };

  handleNonCounterUpload = (report) => {
    const json = JSON.stringify(report);
    const { stripes } = this.props;
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
          response.text().then((t) => this.handleFail(t));
        } else {
          this.handleSuccess();
        }
      })
      .catch((err) => {
        this.handleFail(err.message);
      });
  };

  handleCounterUpload = () => {
    // console.log('counter reports:');
    // console.log(myreportid);

    // const json = JSON.stringify(report);
    const { stripes } = this.props;
    const okapiUrl = stripes.okapi.url;
    const httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        'X-Okapi-Token': stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      }
    );
    fetch(`${okapiUrl}/counter-reports/${myreportid}`, {
      headers: httpHeaders,
      method: 'PUT',
      // body: json,
    })
      .then((response) => {
        if (response.status >= 400) {
          response.text().then((t) => this.handleFail(t));
        } else {
          this.handleSuccess();
        }
      })
      .catch((err) => {
        this.handleFail(err.message);
      });
  };

  schnuff = (reportId) => {
    // console.log('yyy');
    // console.log(reportId);
    myreportid = reportId;
  };

  render() {
    return (
      <>
        <Button
          id="upload-counter-button"
          // onClick={() => this.setShowCounterUpload(true)}
          onClick={() => this.setState({ showCounterUpload: true })}
        >
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload" />
        </Button>
        <Button
          id="upload-non-counter-button"
          // onClick={() => this.setShowNonCounterUpload(true)}
          onClick={() => this.setState({ showNonCounterUpload: true })}
        >
          <FormattedMessage id="ui-erm-usage.statistics.custom.upload" />
        </Button>
        <CounterUpload
          open={this.state.showCounterUpload}
          // onClose={() => this.setShowCounterUpload(false)}
          onClose={() => this.setState({ showCounterUpload: false })}
          onFail={this.handleFail}
          onSubmit={this.handleCounterUpload}
          onSuccess={this.handleSuccess}
          stripes={this.props.stripes}
          udpId={this.props.udpId}
          handlers={this.props.handlers}
          parentCallback={this.schnuff}
        />
        <NonCounterUploadModal
          open={this.state.showNonCounterUpload}
          // onClose={() => this.setShowNonCounterUpload(false)}
          onClose={() => this.setState({ showNonCounterUpload: false })}
          onFail={this.handleFail}
          onSubmit={this.handleNonCounterUpload}
          onSuccess={this.handleSuccess}
          stripes={this.props.stripes}
          udpId={this.props.udpId}
          handlers={this.props.handlers}
        />
        <Callout
          ref={(ref) => {
            callout = ref;
          }}
        />
      </>
    );
  }
}

ReportUpload.propTypes = {
  handlers: PropTypes.shape(),
  intl: PropTypes.object,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default injectIntl(ReportUpload);
