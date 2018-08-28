import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';

class LatestReportDate extends React.Component {
  static propTypes = {
    vendorId: PropTypes.string.isRequired,
    stripes: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.state = {
      date: '-',
    };
  }

  componentDidMount() {
    this.fechLatestReportDate(this.props.vendorId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.fechLatestReportDate(this.props.vendorId);
    }
  }

  fechLatestReportDate = (vendorId) => {
    return fetch(
      `${this.okapiUrl}/counter-reports?limit=1&query=(vendorId==${vendorId}) sortby beginDate/sort.descending`,
      { headers: this.httpHeaders }
    )
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} retrieving vendor name by id`, _error: 'Fetch vendor name failed' });
        } else {
          return response.json();
        }
      })
      .then((json) => {
        const currentReport = json.counterReports[0];
        const latestDate = (currentReport && currentReport.beginDate) ? currentReport.beginDate : '-';
        this.setState({
          date: latestDate
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.date}
      </div>
    );
  }
}

export default LatestReportDate;
