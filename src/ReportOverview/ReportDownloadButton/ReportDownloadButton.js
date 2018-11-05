import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import {
  Button,
  Popover
} from '@folio/stripes/components';

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

  downloadReport = (id) => {
    return fetch(`${this.okapiUrl}/counter-reports/${id}`, { headers: this.httpHeaders })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} downloading counter report by id`, _error: 'Fetch report failed' });
        } else {
          return response.text();
        }
      })
      .then((res) => {
        const anchor = document.createElement('a');
        anchor.href = `data:application/json,${res}`;
        anchor.download = `${id}.json`;
        anchor.click();
      });
  }

  render() {
    const report = this.props.report;
    if (_.isUndefined(report)) {
      return null;
    }

    const isFailed = !!report.failedAttempts;
    if (!isFailed) {
      const reportId = report.id;
      return (
        <Button
          id="clickable-download-stats-by-id"
          buttonStyle="success"
          onClick={() => this.downloadReport(reportId)}
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
