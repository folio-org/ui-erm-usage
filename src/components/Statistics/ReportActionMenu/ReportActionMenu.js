import React from 'react';
import PropTypes from 'prop-types';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Icon,
  KeyValue,
  MenuSection
} from '@folio/stripes/components';

class ReportActionMenu extends React.Component {
  onClickDownloadRawReport = () => {
    this.props.downloadRawReport();
  }

  onClickDownloadCsvReport = () => {
    this.props.downloadCsvReport();
  }

  onClickDeleteReport = () => {
    this.props.deleteReport();
  }

  isCSVPossible = (report) => {
    if (!report.failedReason && report.release === '4' && report.reportName === 'JR1') {
      return true;
    }
    return false;
  }

  renderCSVDownloadButton = (report) => {
    if (this.isCSVPossible(report)) {
      return (
        <Button
          buttonStyle="dropdownItem"
          onClick={() => this.onClickDownloadCsvReport()}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-erm-usage.report.action.download.csv" />
          </Icon>
        </Button>
      );
    } else {
      return null;
    }
  }

  render() {
    const { report, retryThreshold } = this.props;

    const failInfo = !report.failedReason ? null : (
      <KeyValue
        label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.info' })}
        value={report.failedReason}
      />
    );

    const failedAttempts = !report.failedAttempts ? null : (
      <KeyValue
        label={this.props.intl.formatMessage({ id: 'ui-erm-usage.report.action.failedAttempts' })}
        value={`${report.failedAttempts} (Max attempts: ${retryThreshold})`}
      />
    );

    const headerSection = (
      <MenuSection
        id="menu-actions"
        label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.report' })}
        labelTag="h3"
      >
        <KeyValue
          label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.type' })}
          value={report.reportName}
        />
        <KeyValue
          label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.date' })}
          value={report.yearMonth}
        />
        {failInfo}
        {failedAttempts}
      </MenuSection>
    );

    const deleteButton = (
      <Button
        buttonStyle="dropdownItem"
        onClick={() => this.onClickDeleteReport()}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-erm-usage.general.delete" />
        </Icon>
      </Button>
    );

    const rawDownloadButton = failInfo ? null : (
      <Button
        buttonStyle="dropdownItem"
        onClick={() => this.onClickDownloadRawReport()}
      >
        <Icon icon="arrow-down">
          <FormattedMessage id="ui-erm-usage.report.action.download.jsonxml" />
        </Icon>
      </Button>
    );

    const csvDownloadButton = this.renderCSVDownloadButton(report);

    const actionSection = (
      <MenuSection
        id="menu-actions"
        label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.actions' })}
        labelTag="h3"
      >
        { deleteButton }
        { rawDownloadButton }
        { csvDownloadButton }
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
  downloadRawReport: PropTypes.func,
  downloadCsvReport: PropTypes.func,
  retryThreshold: PropTypes.number,
  intl: intlShape.isRequired,
};

export default injectIntl(ReportActionMenu);
