import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Popover
} from '@folio/stripes/components';
import downloadReport from './DownloadReport';

class ReportDownloadButton extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        url: PropTypes.string.isRequired,
        tenant: PropTypes.string.isRequired
      }).isRequired,
      store: PropTypes.shape({
        getState: PropTypes.func
      })
    }).isRequired,
    report: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });
  }

  render() {
    const report = this.props.report;
    if (_.isUndefined(report)) {
      return null;
    }

    const isFailed = !!report.failedAttempts;
    if (!isFailed) {
      return (
        <Button
          id="clickable-download-stats-by-id"
          buttonStyle="success"
          onClick={() => downloadReport(report.id, this.okapiUrl, this.httpHeaders)}
        >
          Y
        </Button>
      );
    } else if (report.failedAttempts < 3) {
      const info = 'Warn: No report available, but will be loaded in future.';
      return (
        <Popover>
          <Button
            id="clickable-download-stats-by-id"
            buttonStyle="warning"
            data-role="target"
          >
            N
          </Button>
          <p data-role="popover">{info}</p>
        </Popover>
      );
    } else {
      const info = 'Error: No report available. Something went wrong. Will NOT try again to fetch report.';
      return (
        <Popover>
          <Button
            id="clickable-download-stats-by-id"
            buttonStyle="danger"
            data-role="target"
          >
            N
          </Button>
          <p data-role="popover">{info}</p>
        </Popover>
      );
    }
  }
}

export default ReportDownloadButton;
