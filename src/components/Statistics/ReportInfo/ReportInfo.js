import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Icon,
  KeyValue,
  MenuSection
} from '@folio/stripes/components';
import reportDownloadTypes from '../../../util/data/reportDownloadTypes';

class ReportInfo extends React.Component {
  onClickDownloadRawReport = () => {
    this.props.downloadRawReport();
  }

  onClickDownloadCsvReport = () => {
    this.props.downloadCsvReport();
  }

  onClickDeleteReport = () => {
    this.props.deleteReport();
  }

  isDownloadable = (reportName) => {
    const result = reportDownloadTypes.find(e => e.value === reportName);
    return result !== undefined;
  }

  isCSVPossible = (report) => {
    if (!report.failedReason && this.isDownloadable(report.reportName)) {
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

  renderDeleteButton = (failInfo) => {
    let msg = <FormattedMessage id="ui-erm-usage.report.action.general.delete.report" />;
    if (failInfo) {
      msg = <FormattedMessage id="ui-erm-usage.report.action.general.delete.entry" />;
    }
    return (
      <Button
        id="delete-report-button"
        buttonStyle="dropdownItem"
        onClick={() => this.onClickDeleteReport()}
      >
        <Icon icon="trash">
          { msg }
        </Icon>
      </Button>
    );
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
          label="Usage data provider"
          value={this.props.udpLabel}
        />
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

    const rawDownloadButton = failInfo ? null : (
      <Button
        id="download-json-xml-button"
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
        { this.renderDeleteButton(failInfo) }
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

ReportInfo.propTypes = {
  report: PropTypes.object,
  deleteReport: PropTypes.func,
  downloadRawReport: PropTypes.func,
  downloadCsvReport: PropTypes.func,
  retryThreshold: PropTypes.number,
  intl: PropTypes.object,
  udpLabel: PropTypes.string.isRequired,
};

export default injectIntl(ReportInfo);
