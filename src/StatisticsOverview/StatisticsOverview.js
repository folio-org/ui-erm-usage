import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';

class StatisticsOverview extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      path: 'counter-reports?query=(vendorId==%{vendorId.id} and platformId=%{platformId.id}) sortby beginDate/sort.descending',
    },
    vendorId: { id: null },
    platformId: { id: null },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }).isRequired,
    resources: PropTypes.shape({
      counterReports: PropTypes.shape(),
    }),
    vendorId: PropTypes.string.isRequired,
    platformId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });
    
    this.props.mutator.vendorId.replace({ id: props.vendorId });
    this.props.mutator.platformId.replace({ id: props.platformId });
  }

  componentDidUpdate(prevProps) {
    if (this.props.vendorId !== prevProps.vendorId) {
      this.props.mutator.vendorId.replace({ id: this.props.vendorId });
    }
    if (this.props.platformId !== prevProps.platformId) {
      this.props.mutator.platformId.replace({ id: this.props.platformId });
    }
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

  renderStats = (stats) => {
    return stats.map(e => {
      const begin = `Begin: ${e.beginDate} -- `;
      const report = `Report: ${e.reportName} -- `;
      const release = `Release: ${e.release} -- `;
      const format = `Format: ${e.format} -- `;
      const reportId = e.id;
      return (
        <div>
          { begin }
          { report }
          { release }
          { format }
          <Button
            id="clickable-download-stats-by-id"
            onClick={() => this.downloadReport(reportId)}
          >
            Download
          </Button>
        </div>
      );
    });
  }

  render() {
    const { resources } = this.props;
    const records = (resources.counterReports || {}).records || null;

    const numberReports = !_.isEmpty(records) ? records[0].totalRecords : 0;
    const stats = !_.isEmpty(records) ? records[0].counterReports : [];
    const renderedStats = this.renderStats(stats);
    const res = `Found ${numberReports} reports`;
    return (
      <div>
        { res }
        { renderedStats }
      </div>
    );
  }
}

export default StatisticsOverview;
