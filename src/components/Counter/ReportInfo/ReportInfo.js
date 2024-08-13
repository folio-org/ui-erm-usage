import PropTypes from 'prop-types';
import { get } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';

import { Button, Icon, KeyValue, MenuSection } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import reportDownloadTypes from '../../../util/data/reportDownloadTypes';
import isSushiWarningCode from '../../../util/isSushiWarningCode';

const ReportInfo = ({
  report,
  deleteReport,
  downloadRawReport,
  downloadReport,
  retryThreshold,
  intl,
  udpLabel,
}) => {
  const getFileType = (release) => {
    if (release === '4') {
      return 'xml';
    } else if (release === '5') {
      return 'json';
    } else {
      return 'unknown';
    }
  };

  const onClickDownloadRawReport = (release) => {
    const fileType = getFileType(release);
    downloadRawReport(fileType);
  };

  const onClickDownloadReport = (format) => {
    downloadReport(format);
  };

  const onClickDeleteReport = () => {
    deleteReport();
  };

  const isDownloadable = (reportName) => {
    const result = reportDownloadTypes.find((e) => e.value === reportName);
    return result !== undefined;
  };

  const isCSVPossible = (rep) => {
    if (!rep.failedReason && isDownloadable(rep.reportName)) {
      return true;
    }
    return false;
  };

  const renderCSVDownloadButton = (rep) => {
    if (isCSVPossible(rep)) {
      return (
        <Button
          buttonStyle="dropdownItem"
          onClick={() => onClickDownloadReport('csv')}
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

  const renderXLSXDownloadButton = (rep) => {
    if (isCSVPossible(rep)) {
      return (
        <Button
          buttonStyle="dropdownItem"
          onClick={() => onClickDownloadReport('xlsx')}
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

  const renderDeleteButton = (failInfo) => {
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
          onClick={() => onClickDeleteReport()}
        >
          <Icon icon="trash">{msg}</Icon>
        </Button>
      </IfPermission>
    );
  };

  const renderRawDownloadButton = (rep) => {
    if (rep.failedReason) {
      return null;
    }
    const filetype = getFileType(rep.release).toUpperCase();
    return (
      <Button
        id="download-json-xml-button"
        buttonStyle="dropdownItem"
        onClick={() => onClickDownloadRawReport(rep.release)}
      >
        <Icon icon="arrow-down">
          <FormattedMessage
            id="ui-erm-usage.report.action.download.jsonxml"
            values={{ filetype }}
          />
        </Icon>
      </Button>
    );
  };

  const manualEditedText = () => {
    const editReason = ` ${get(report, 'editReason', '-')}`;
    return (
      <>
        <FormattedMessage id="ui-erm-usage.general.manualChanges.infoText" />
        <br />
        <FormattedMessage id="ui-erm-usage.general.editReason" />
        {editReason}
      </>
    );
  };

  const translateErrorCodes = (val) => {
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

  const adaptSushiFailedInfo = (failedReason) => {
    const matchResult = failedReason.match('(?:Number=|"Code": ?)([0-9]{1,4})');
    return (matchResult !== null) ? translateErrorCodes(matchResult[1]) : failedReason;
  };

  const failInfo = !report.failedReason ? null : (
    <KeyValue
      data-test-report-failed-reason
      label={intl.formatMessage({
        id: 'ui-erm-usage.general.info',
      })}
      value={adaptSushiFailedInfo(report.failedReason)}
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
      value={manualEditedText()}
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
      <KeyValue label="Usage data provider" value={udpLabel} />
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

  const rawDownloadButton = renderRawDownloadButton(report);

  const csvDownloadButton = renderCSVDownloadButton(report);
  const xslxDownloadButton = renderXLSXDownloadButton(report);

  const actionSection = (
    <MenuSection
      id="menu-actions"
      label={intl.formatMessage({
        id: 'ui-erm-usage.general.actions',
      })}
      labelTag="h3"
    >
      {renderDeleteButton(failInfo)}
      {rawDownloadButton}
      {csvDownloadButton}
      {xslxDownloadButton}
    </MenuSection>
  );

  return (
    <>
      {headerSection}
      {actionSection}
    </>
  );
};

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
