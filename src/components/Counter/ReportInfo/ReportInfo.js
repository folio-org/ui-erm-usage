import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, KeyValue, MenuSection } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import reportDownloadTypes from '../../../util/data/reportDownloadTypes';
import isSushiWarningCode from '../../../util/isSushiWarningCode';

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
      <IfPermission perm="ui-erm-usage.reports.delete">
        <Button
          id="delete-report-button"
          buttonStyle="dropdownItem"
          onClick={() => this.onClickDeleteReport()}
        >
          <Icon icon="trash">{msg}</Icon>
        </Button>
      </IfPermission>
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
    const editReason = ` ${get(this.props.report, 'editReason', '-')}`;
    return (
      <>
        <FormattedMessage id="ui-erm-usage.general.manualChanges.infoText" />
        <br />
        <FormattedMessage id="ui-erm-usage.general.editReason" />
        {editReason}
      </>
    );
  }

  translateErrorCodes = (val) => {
    const { intl } = this.props;
    let label;
    if (isSushiWarningCode(val)) {
      label = `${intl.formatMessage({
        id: 'ui-erm-usage.report.error.1',
      })} (${val})`;
    } else {
      const id = `ui-erm-usage.report.error.${val}`;
      label = `${intl.formatMessage({
        id,
      })} (${val})`;
    }
    return `${intl.formatMessage({
      id: 'ui-erm-usage.report.error.sushiException',
    })}: ${label}`;
  };

  adaptSushiFailedInfo(failedReason) {
    const matchResult = failedReason.match('(?:Number=|"Code": ?)([0-9]{1,4})');
    return (matchResult !== null) ? this.translateErrorCodes(matchResult[1]) : failedReason;
  }

  render() {
    const { intl, report, retryThreshold } = this.props;

    const failInfo = !report.failedReason ? null : (
      <KeyValue
        data-test-report-failed-reason
        label={intl.formatMessage({
          id: 'ui-erm-usage.general.info',
        })}
        value={this.adaptSushiFailedInfo(report.failedReason)}
      />
    );

    const failedAttempts = !report.failedAttempts ? null : (
      <KeyValue
        label={intl.formatMessage({
          id: 'ui-erm-usage.report.action.failedAttempts',
        })}
        value={intl.formatMessage(
          {
            id: 'ui-erm-usage.statistics.report.info.maxAttempts',
          },
          {
            current: report.failedAttempts,
            max: retryThreshold,
          }
        )}
      />
    );

    const displayManualEdited = report.reportEditedManually ? (
      <KeyValue
        data-test-custom-reports-edited-manually
        label={intl.formatMessage({
          id: 'ui-erm-usage.general.manualChanges',
        })}
        value={this.manualEditedText()}
      />
    ) : (
      ''
    );

    const headerSection = (
      <MenuSection
        id="menu-actions"
        label={intl.formatMessage({
          id: 'ui-erm-usage.general.report',
        })}
        labelTag="h3"
      >
        <KeyValue label="Usage data provider" value={this.props.udpLabel} />
        <KeyValue
          label={intl.formatMessage({
            id: 'ui-erm-usage.general.type',
          })}
          value={report.reportName}
        />
        <KeyValue
          label={intl.formatMessage({
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
        label={intl.formatMessage({
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
