import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  Icon,
  KeyValue,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import rawDownloadCounterReportTypeMapping from '../../../util/data/downloadReportTypesOptions';
import extractErrorCode from '../../../util/extractErrorCode';
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
    } else if (release === '5' || release === '5.1') {
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

  const isDownloadable = (release, reportName) => {
    return rawDownloadCounterReportTypeMapping[release]?.[reportName] !== undefined;
  };

  const isCSVPossible = (rep) => !rep.failedReason && isDownloadable(rep.release, rep.reportName);

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
    let msg = <FormattedMessage id="ui-erm-usage.report.action.general.delete.report" />;

    if (failInfo) {
      msg = <FormattedMessage id="ui-erm-usage.report.action.general.delete.entry" />;
    }

    return (
      <IfPermission perm="ui-erm-usage.reports.delete">
        <Button
          buttonStyle="dropdownItem"
          id="delete-report-button"
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
        buttonStyle="dropdownItem"
        id="download-json-xml-button"
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
      label = `${intl.formatMessage({ id: 'ui-erm-usage.report.error.1' })} (${val})`;
    } else {
      const id = `ui-erm-usage.report.error.${val}`;
      label = `${intl.formatMessage({ id })} (${val})`;
    }

    return `${intl.formatMessage({ id: 'ui-erm-usage.report.error.exception' })}: ${label}`;
  };

  const adaptSushiAndHtmlFailedInfo = (failedReason) => {
    const error = failedReason ? extractErrorCode(failedReason) : null;

    if (error !== null) {
      return translateErrorCodes(error.code);
    } else if (failedReason.includes('<html')) {
      const htmlError =
        <details>
          <summary><b>{intl.formatMessage({ id: 'ui-erm-usage.report.error.htmlResponse' })}</b></summary>
          {failedReason}
        </details>;
      return htmlError;
    } else {
      return failedReason;
    }
  };

  const failInfo = !report.failedReason ? null : (
    <KeyValue
      label={intl.formatMessage({ id: 'ui-erm-usage.general.info' })}
      value={adaptSushiAndHtmlFailedInfo(report.failedReason)}
    />
  );

  const failedAttempts = !report.failedAttempts ? null : (
    <KeyValue
      label={intl.formatMessage({ id: 'ui-erm-usage.report.action.failedAttempts' })}
      value={intl.formatMessage(
        { id: 'ui-erm-usage.statistics.report.info.maxAttempts' },
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
      label={intl.formatMessage({ id: 'ui-erm-usage.general.manualChanges' })}
      value={manualEditedText()}
    />
  ) : (
    ''
  );

  const headerSection = (
    <MenuSection
      id="menu-actions"
      label={intl.formatMessage({ id: 'ui-erm-usage.general.report' })}
      labelTag="h3"
    >
      <KeyValue label="Usage data provider" value={udpLabel} />
      <KeyValue
        label={intl.formatMessage({ id: 'ui-erm-usage.general.type' })}
        value={report.reportName}
      />
      <KeyValue
        label={intl.formatMessage({ id: 'ui-erm-usage.general.date' })}
        value={report.yearMonth}
      />
      {displayManualEdited}
      {failInfo}
      {failedAttempts}
    </MenuSection>
  );

  const actionSection = (
    <MenuSection
      id="menu-actions"
      label={intl.formatMessage({ id: 'ui-erm-usage.general.actions' })}
      labelTag="h3"
    >
      {renderDeleteButton(failInfo)}
      {renderRawDownloadButton(report)}
      {renderCSVDownloadButton(report)}
      {renderXLSXDownloadButton(report)}
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
  deleteReport: PropTypes.func,
  downloadRawReport: PropTypes.func,
  downloadReport: PropTypes.func,
  intl: PropTypes.object,
  report: PropTypes.object,
  retryThreshold: PropTypes.number,
  udpLabel: PropTypes.string.isRequired,
};

export default injectIntl(ReportInfo);
