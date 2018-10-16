import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';

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
      return (
        <Button
          id="clickable-download-stats-by-id"
          buttonStyle="warning"
        >
          N
        </Button>
      );
    } else {
      return (
        <Button
          id="clickable-download-stats-by-id"
          buttonStyle="danger"
        >
          N
        </Button>
      );
    }
  }
}

export default ReportDownloadButton;
