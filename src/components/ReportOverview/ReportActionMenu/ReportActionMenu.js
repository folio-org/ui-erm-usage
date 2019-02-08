import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  KeyValue,
  MenuSection
} from '@folio/stripes/components';

class ReportActionMenu extends React.Component {
  getFailInfo = (report) => {
    const failedReason = report.failedReason;
    return failedReason;
  }

  getFailedAttempts = (report) => {
    return report.getFailedAttempts;
  }

  onClickDownloadReport = () => {
    this.props.downloadReport();
  }

  onClickDeleteReport = () => {
    this.props.deleteReport();
  }

  render() {
    const { report, retryThreshold } = this.props;
    const failingInfo = this.getFailInfo(report);

    const failInfo = !failingInfo ? null : (
      <KeyValue
        label="Info"
        value={failingInfo}
      />
    );

    const failedAttempts = !report.failedAttempts ? null : (
      <KeyValue
        label="Failed Attempts"
        value={`${report.failedAttempts} (Max attempts: ${retryThreshold})`}
      />
    );

    const headerSection = (
      <MenuSection id="menu-actions" label="Report" labelTag="h3">
        <KeyValue label="Type" value={report.reportName} />
        <KeyValue label="Date" value={report.yearMonth} />
        {failInfo}
        {failedAttempts}
      </MenuSection>
    );

    const deleteButton = (
      <Button buttonStyle="dropdownItem" onClick={() => this.onClickDeleteReport()}>
        <Icon icon="trash">Delete</Icon>
      </Button>
    );

    const downloadButton = failInfo ? null : (
      <Button buttonStyle="dropdownItem" onClick={() => this.onClickDownloadReport()}>
        <Icon icon="arrow-down">Download</Icon>
      </Button>
    );

    const actionSection = (
      <MenuSection id="menu-actions" label="Actions" labelTag="h3">
        { deleteButton }
        { downloadButton }
      </MenuSection>
    );

    return (
      <React.Fragment>
        {headerSection}
        {actionSection}
      </React.Fragment>
    );
  }
}

ReportActionMenu.propTypes = {
  report: PropTypes.object,
  deleteReport: PropTypes.func,
  downloadReport: PropTypes.func,
  retryThreshold: PropTypes.int,
};

export default ReportActionMenu;
