import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Callout } from '@folio/stripes-components';

import CounterUpload from './CounterUploadModal/CounterUpload';
import NonCounterUploadModal from './NonCounterUploadModal';

let callout;

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
      showCounterUpload: false,
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

  handleSubmit = () => {
    return null;
  }

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
          onSubmit={this.handleSubmit}
          onSuccess={this.handleSuccess}
          stripes={this.props.stripes}
          udpId={this.props.udpId}
          handlers={this.props.handlers}
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
          id="report-update-callout"
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
