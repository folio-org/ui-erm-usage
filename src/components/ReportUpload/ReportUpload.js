import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Callout } from '@folio/stripes-components';

import CounterUpload from './CounterUploadModal/CounterUpload';
import NonCounterUploadModal from './NonCounterUploadModal';

let callout;
let globalReportId;

class ReportUpload extends React.Component {
  constructor(props) {
    super(props);

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
    callout.sendCallout({
      message: info,
    });
    this.setState({
      showCounterUpload: true,
      showNonCounterUpload: false,
    });
  };

  handleFail = (msg) => {
    const failText = this.props.intl.formatMessage({
      id: 'ui-erm-usage.report.upload.failed',
    });
    callout.sendCallout({
      type: 'error',
      message: `${failText} ${msg}`,
      timeout: 0,
    });
    this.setState({
      showCounterUpload: true,
      showNonCounterUpload: false,
    });
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

  handleCounterUpload = (data) => {
    const json = JSON.stringify(data);
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

    let report;
    // GET counter-report
    fetch(`${okapiUrl}/counter-reports/${globalReportId}`, {
      headers: httpHeaders,
      method: 'GET',
    })
      .then((response) => {
        if (response.status >= 400) {
          response.text().then((t) => this.handleFail(t));
        } else {
          response.text().then(text => {
            report = text.replace('Saved report with ids: ', '');
            // add reportEditedManually and editReason to report
            let test = {};
            test = Object.assign(test, JSON.parse(report));
            test = Object.assign(test, JSON.parse(json));

            // PUT counter-report
            fetch(`${okapiUrl}/counter-reports/${globalReportId}`, {
              headers: httpHeaders,
              method: 'PUT',
              body: JSON.stringify(test),
            })
              .then((putResponse) => {
                if (putResponse.status >= 400) {
                  putResponse.text().then((t) => this.handleFail(t));
                } else {
                  this.handleSuccess();
                }
              })
              .catch((err) => {
                this.handleFail(err.message);
              });
          });
          this.handleSuccess();
        }
      });
  };

  setReportId = (reportId) => {
    globalReportId = reportId;
  };

  render() {
    return (
      <>
        <Button
          id="upload-counter-button"
          onClick={() => this.setState({ showCounterUpload: true })}
        >
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload" />
        </Button>
        <Button
          id="upload-non-counter-button"
          onClick={() => this.setState({ showNonCounterUpload: true })}
        >
          <FormattedMessage id="ui-erm-usage.statistics.custom.upload" />
        </Button>
        <CounterUpload
          open={this.state.showCounterUpload}
          onClose={() => this.setState({ showCounterUpload: false })}
          onFail={this.handleFail}
          onSubmit={this.handleCounterUpload}
          onSuccess={this.handleSuccess}
          stripes={this.props.stripes}
          udpId={this.props.udpId}
          handlers={this.props.handlers}
          parentCallback={this.setReportId}
        />
        <NonCounterUploadModal
          open={this.state.showNonCounterUpload}
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
