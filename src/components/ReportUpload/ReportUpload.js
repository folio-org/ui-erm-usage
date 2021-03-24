import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Callout } from '@folio/stripes-components';

import CounterUpload from './CounterUpload';
import NonCounterUpload from './NonCounterUpload';

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
    this.props.onReloadStatistics();
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
      showCounterUpload: false,
      showNonCounterUpload: false,
    });
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
          onSuccess={this.handleSuccess}
          stripes={this.props.stripes}
          udpId={this.props.udpId}
        />
        <NonCounterUpload
          open={this.state.showNonCounterUpload}
          onClose={() => this.setState({ showNonCounterUpload: false })}
          onFail={this.handleFail}
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
  onReloadStatistics: PropTypes.func.isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
};

export default injectIntl(ReportUpload);
