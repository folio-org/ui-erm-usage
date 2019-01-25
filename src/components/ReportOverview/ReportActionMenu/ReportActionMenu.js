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
    const failedAttempts = report.failedAttempts;
    if (!failedAttempts || failedAttempts === 0) {
      return null;
    } else if (failedAttempts < 3) {
      return 'Warn: No report available, but will be loaded in future.';
    } else {
      return 'Error: No report available. Something went wrong. Will NOT try again to fetch report.';
    }
  }

  onClickDownloadReport = () => {
    this.props.downloadReport();
  }

  onClickDeleteReport = () => {
    this.props.deleteReport();
  }

  render() {
    const { report } = this.props;
    const failingInfo = this.getFailInfo(report);

    const failInfo = !failingInfo
      ? null
      : (<KeyValue label="Info" value={failingInfo} />);
    const headerSection = (
      <MenuSection id="menu-actions" label="Report" labelTag="h3">
        <KeyValue label="Type" value={report.reportName} />
        <KeyValue label="Date" value={report.yearMonth} />
        {failInfo}
      </MenuSection>
    );

    const buttons = [];
    buttons.push(
      <Button buttonStyle="dropdownItem" onClick={() => this.onClickDeleteReport()}>
        <Icon icon="trash">Delete</Icon>
      </Button>
    );
    if (!failingInfo) {
      buttons.push(
        <Button buttonStyle="dropdownItem" onClick={() => this.onClickDownloadReport()}>
          <Icon icon="arrow-down">Download</Icon>
        </Button>
      );
    }
    const actionSection = (
      <MenuSection id="menu-actions" label="Actions" labelTag="h3">
        {buttons}
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
};

export default ReportActionMenu;
