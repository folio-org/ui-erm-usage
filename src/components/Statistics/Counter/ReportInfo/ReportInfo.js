import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Button,
  Icon,
  KeyValue,
  MenuSection,
} from '@folio/stripes/components';
import reportDownloadTypes from '../../../../util/data/reportDownloadTypes';

class ReportInfo extends React.Component {
  onClickDownloadRawReport = (release) => {
    const fileType = this.getFileType(release);
    this.props.downloadRawReport(fileType);
  };

  onClickDownloadReport = (format) => {
    this.props.downloadReport(format);
  };

  onClickDeleteReport = () => {
    this.props.deleteReport();
  };

  isDownloadable = (reportName) => {
    const result = reportDownloadTypes.find((e) => e.value === reportName);
    return result !== undefined;
  };

  isCSVPossible = (report) => {
    if (!report.failedReason && this.isDownloadable(report.reportName)) {
      return true;
    }
    return false;
  };

  getFileType = (release) => {
    if (release === '4') {
      return 'xml';
    } else if (release === '5') {
      return 'json';
    } else {
      return 'unknown';
    }
  };

  renderCSVDownloadButton = (report) => {
    if (this.isCSVPossible(report)) {
      return (
        <Button
          buttonStyle="dropdownItem"
          onClick={() => this.onClickDownloadReport('csv')}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-erm-usage.report.action.download.csv" />
          </Icon>
        </Button>
      );
    } else {
      return null;
    }
  };

  renderXLSXDownloadButton = (report) => {
    if (this.isCSVPossible(report)) {
      return (
        <Button
          buttonStyle="dropdownItem"
          onClick={() => this.onClickDownloadReport('xlsx')}
        >
          <Icon icon="arrow-down">
            <FormattedMessage id="ui-erm-usage.report.action.download.xlsx" />
          </Icon>
        </Button>
      );
    } else {
      return null;
    }
  };

  renderDeleteButton = (failInfo) => {
    let msg = (
      <FormattedMessage id="ui-erm-usage.report.action.general.delete.report" />
    );
    if (failInfo) {
      msg = (
        <FormattedMessage id="ui-erm-usage.report.action.general.delete.entry" />
      );
    }
    return (
      <Button
        id="delete-report-button"
        buttonStyle="dropdownItem"
        onClick={() => this.onClickDeleteReport()}
      >
        <Icon icon="trash">{msg}</Icon>
      </Button>
    );
  };

  renderRawDownloadButton = (report) => {
    if (report.failedReason) {
      return null;
    }
    const filetype = this.getFileType(report.release).toUpperCase();
    return (
      <Button
        id="download-json-xml-button"
        buttonStyle="dropdownItem"
        onClick={() => this.onClickDownloadRawReport(report.release)}
      >
        <Icon icon="arrow-down">
          <FormattedMessage
            id="ui-erm-usage.report.action.download.jsonxml"
            values={{
              filetype,
            }}
          />
        </Icon>
      </Button>
    );
  };

  manualEditedText() {
    return (
      <>
        <FormattedMessage id="ui-erm-usage.general.manualChanges.infoText" />
        <br />
        <FormattedMessage id="ui-erm-usage.general.editReason" />
        {_.get(this.props.report, 'editReason', '-')}
      </>
    );
  }

  getFailedInfo(failedReason) {
    let newReason;
    // const errorCode = failedReason.match(/(?<=Number=\s+).*?(?=\s+,)/gs);
    // const errorCode = failedReason.substring(failedReason.indexOf('Number=') + 1);
    const errorCode = failedReason.match('Number=(.*), Severity=')[1];

    if (errorCode === '1000' || errorCode === '1010' || errorCode === '1011' || errorCode === '1020' ||
        errorCode === '1030' || errorCode === '2000' || errorCode === '2010' || errorCode === '2020' ||
        errorCode === '3000' || errorCode === '3010' || errorCode === '3020' || errorCode === '3030' ||
        errorCode === '3031' || errorCode === '3040' || errorCode === '3050' || errorCode === '3060' ||
        errorCode === '3061' || errorCode === '3062' || errorCode === '3070' ||
        errorCode === '3071' || errorCode === '3080') {
      const translatedErrorCode = `${this.props.intl.formatMessage({
        id: `ui-erm-usage.report.error.${errorCode}`
      })} (${errorCode})`;
      newReason = `SUSHI exception: xxx (xxx) ${translatedErrorCode}`;
    } else {
      newReason = failedReason;
    }
    return newReason;
  }

  render() {
    const { report, retryThreshold } = this.props;

    const failedInfo = this.getFailedInfo(report.failedReason);

    const failInfo = !report.failedReason ? null : (
      <KeyValue
        label={this.props.intl.formatMessage({
          id: 'ui-erm-usage.general.info',
        })}
        // value={report.failedReason}
        value={failedInfo}
      />
    );

    const failedAttempts = !report.failedAttempts ? null : (
      <KeyValue
        label={this.props.intl.formatMessage({
          id: 'ui-erm-usage.report.action.failedAttempts',
        })}
        value={`${report.failedAttempts} (Max attempts: ${retryThreshold})`}
      />
    );

    const displayManualEdited = (
      report.reportEditedManually ?
        <KeyValue
          data-test-custom-reports-edited-manually
          label={this.props.intl.formatMessage({ id: 'ui-erm-usage.general.manualChanges' })}
          value={this.manualEditedText()}
        />
        : '');

    const headerSection = (
      <MenuSection
        id="menu-actions"
        label={this.props.intl.formatMessage({
          id: 'ui-erm-usage.general.report',
        })}
        labelTag="h3"
      >
        <KeyValue label="Usage data provider" value={this.props.udpLabel} />
        <KeyValue
          label={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.type',
          })}
          value={report.reportName}
        />
        <KeyValue
          label={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.date',
          })}
          value={report.yearMonth}
        />
        {displayManualEdited}
        {failInfo}
        {failedAttempts}
      </MenuSection>
    );

    const rawDownloadButton = this.renderRawDownloadButton(report);

    const csvDownloadButton = this.renderCSVDownloadButton(report);
    const xslxDownloadButton = this.renderXLSXDownloadButton(report);

    const actionSection = (
      <MenuSection
        id="menu-actions"
        label={this.props.intl.formatMessage({
          id: 'ui-erm-usage.general.actions',
        })}
        labelTag="h3"
      >
        {this.renderDeleteButton(failInfo)}
        {rawDownloadButton}
        {csvDownloadButton}
        {xslxDownloadButton}
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
  downloadReport: PropTypes.func,
  retryThreshold: PropTypes.number,
  intl: PropTypes.object,
  udpLabel: PropTypes.string.isRequired,
};

export default injectIntl(ReportInfo);
