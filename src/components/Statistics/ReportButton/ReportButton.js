import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import { SubmissionError } from 'redux-form';
import {
  Button,
  ConfirmationModal,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';
import saveAs from 'file-saver';

import ReportActionMenu from '../ReportActionMenu';

class ReportButton extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      GET: {
        path: 'counter-reports/!{report.id}',
      },
      DELETE: {
        path: 'counter-reports',
      },
    }
  });

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.state = {
      showDropDown: false,
      showConfirmDelete: false
    };

    this.RETRY_THRESHOLD = 3;
  }

  getFileType = () => {
    // TODO: Backend needs implementation to return xml reports. Currently, it returns json reports only
    return 'json';
    // if (format === 'json') {
    //   return 'json';
    // } else {
    //   return 'xml';
    // }
  }

  getButtonStyle = (failedAttempts) => {
    if (!failedAttempts) {
      return 'success';
    } else if (failedAttempts < this.RETRY_THRESHOLD) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getButtonIcon = (failedAttempts) => {
    if (!failedAttempts) {
      return <Icon icon="check-circle" />;
    } else if (failedAttempts < this.RETRY_THRESHOLD) {
      return <Icon icon="exclamation-circle" />;
    } else {
      return <Icon icon="times-circle" />;
    }
  }

  saveReport = (id, reportData, fileType) => {
    const blob = new Blob([reportData], { type: fileType });
    const fileName = `${id}.${fileType}`;
    saveAs(blob, fileName);
  }

  downloadRawReport = () => {
    this.setState(() => ({ showDropDown: false }));
    this.props.mutator.counterReports.GET()
      .then((report) => {
        const fileType = this.getFileType(report.format);
        const reportData = JSON.stringify(report.report);
        this.saveReport(report.id, reportData, fileType);
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Download of counter report failed: ' + infoText);
      });
  }

  downloadCsvReport = () => {
    this.setState(() => ({ showDropDown: false }));
    const id = this.props.report.id;
    return fetch(`${this.okapiUrl}/counter-reports/csv/${id}`, { headers: this.httpHeaders })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} retrieving counter csv report by id`, _error: 'Fetch counter csv failed' });
        } else {
          return response.text();
        }
      })
      .then((text) => {
        const fileType = 'csv';
        this.saveReport(id, text, fileType);
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Download of counter csv report failed: ' + infoText);
      });
  }

  deleteReport = () => {
    this.setState({
      showConfirmDelete: true,
      showDropDown: false
    });
  };

  doDelete = () => {
    const { report } = this.props;
    this.props.mutator.counterReports.DELETE({ id: report.id })
      .then(() => {
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Delete of counter report failed: ' + infoText);
      });
    this.setState(() => ({ showConfirmDelete: false }));
  };

  hideConfirm = () => {
    this.setState({ showConfirmDelete: false });
  };

  render() {
    const { report } = this.props;
    if (_.isUndefined(report)) {
      return null;
    }

    const icon = this.getButtonIcon(report.failedAttempts);
    const style = this.getButtonStyle(report.failedAttempts);

    const confirmMessage = (
      <div>
        <p>Do you really want to delete this report?</p>
        <p>{`${this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.reportType' })}: ${report.reportName} -- ${this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.reportType' })}: ${report.yearMonth}`}</p>
      </div>
    );

    return (
      <React.Fragment>
        <Dropdown
          id="report-action-dropdown"
          onToggle={() => this.setState(state => ({ showDropDown: !state.showDropDown }))}
          tether={{
            attachment: 'top left',
            targetAttachment: 'bottom left',
            targetOffset: '15px 0',
          }}
          open={this.state.showDropDown}
        >
          <Button
            id="clickable-download-stats-by-id"
            buttonStyle={style}
            data-role="toggle"
            aria-haspopup="true"
          >
            { icon }
          </Button>
          <DropdownMenu
            data-role="menu"
          >
            <ReportActionMenu
              report={report}
              deleteReport={this.deleteReport}
              downloadRawReport={this.downloadRawReport}
              downloadCsvReport={this.downloadCsvReport}
              retryThreshold={this.RETRY_THRESHOLD}
            />
          </DropdownMenu>
        </Dropdown>
        <ConfirmationModal
          open={this.state.showConfirmDelete}
          heading={<FormattedMessage id="ui-erm-usage.reportOverview.confirmDelete" />}
          message={confirmMessage}
          onConfirm={this.doDelete}
          confirmLabel={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.yes' })}
          onCancel={this.hideConfirm}
          cancelLabel={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.no' })}
        />
      </React.Fragment>
    );
  }
}

ReportButton.propTypes = {
  stripes: PropTypes
    .shape().isRequired,
  report: PropTypes.object,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
    csvReports: PropTypes.object,
  }),
  intl: intlShape.isRequired,
};

export default injectIntl(ReportButton);
