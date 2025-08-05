import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  ConfirmationModal,
  Icon,
  Modal,
} from '@folio/stripes/components';

import ReportInfo from '../ReportInfo';

const ReportInfoButton = ({
  stripes,
  report,
  mutator,
  intl,
  maxFailedAttempts,
  udpLabel,
  handlers,
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const log = stripes.logger.log.bind(stripes.logger);

  const getButtonStyle = (failedAttempts, errorCode) => {
    if (!failedAttempts || (errorCode && errorCode === '3030')) {
      return 'success slim';
    } else if (failedAttempts < maxFailedAttempts) {
      return 'warning slim';
    } else {
      return 'danger slim';
    }
  };

  const getButtonIcon = (errorCode) => {
    if (!report.failedAttempts && report?.reportEditedManually) {
      return <Icon icon="edit" />;
    } else if (!report.failedAttempts) {
      return <Icon icon="check-circle" />;
    } else if (report.failedAttempts < maxFailedAttempts) {
      return <Icon icon="exclamation-circle" />;
    } else if (report.failedReason && errorCode === '3030') {
      return <Icon icon="default" />;
    } else {
      return <Icon icon="times-circle" />;
    }
  };

  const downloadRawReport = (fileType) => {
    setShowDropDown(false);
    const id = report.id;
    handlers.onDownloadReportSingleMonthRaw(id, fileType);
  };

  const downloadReport = (format) => {
    setShowDropDown(false);
    const id = report.id;
    handlers.onDownloadReportSingleMonth(id, format);
  };

  const deleteReport = () => {
    setShowConfirmDelete(true);
    setShowDropDown(false);
  };

  const doDelete = () => {
    mutator.counterReports
      .DELETE({ id: report.id })
      .then(() => {})
      .catch((err) => {
        const failText = intl.formatMessage({
          id: 'ui-erm-usage.report.upload.failed',
        });
        const infoText = failText + ' ' + err.message;
        log('Delete of counter report failed: ' + infoText);
      });
    setShowConfirmDelete(false);
  };

  const hideConfirm = () => {
    setShowConfirmDelete(false);
  };

  const handleClose = () => {
    setShowDropDown(false);
  };

  if (isNil(report)) {
    return null;
  }

  const errorCode = report.failedReason?.match('(?:Number=|"Code": ?)([0-9]{1,4})');
  const icon = getButtonIcon(errorCode?.[1]);
  const style = getButtonStyle(report.failedAttempts, errorCode?.[1]);

  const confirmMessage = (
    <>
      <span>
        {intl.formatMessage({
          id: 'ui-erm-usage.statistics.delete',
        })}
        <br />
      </span>
      <span>
        {`${intl.formatMessage({
          id: 'ui-erm-usage.reportOverview.reportType',
        })}:
          ${report.reportName} --
          ${intl.formatMessage({ id: 'ui-erm-usage.reportOverview.reportDate' })}:
          ${report.yearMonth}`}
      </span>
    </>
  );

  const buttonId = `clickable-download-stats-by-id-${report.reportName}-${report.yearMonth}`;
  const dropdownId = `report-info-${report.reportName}-${report.yearMonth}`;
  const failedInfo = report.failedAttempts
    ? intl.formatMessage({ id: 'ui-erm-usage.statistics.harvesting.error' })
    : intl.formatMessage({ id: 'ui-erm-usage.statistics.harvesting.success' });
  const label = `Open report info for report ${report.reportName} at year month ${report.yearMonth}. ${failedInfo}`;
  const reportInfoClassName = report.failedAttempts
    ? 'report-info-failed'
    : 'report-info-valid';

  const footer = (
    <Button id="close-report-info-button" onClick={handleClose}>
      Close
    </Button>
  );

  return (
    <>
      <Button
        bottomMargin0
        aria-label={label}
        id={buttonId}
        data-testid={buttonId}
        buttonStyle={style}
        aria-haspopup="true"
        onClick={() => setShowDropDown(curState => !curState)}
      >
        {icon}
      </Button>
      <Modal
        id={dropdownId}
        closeOnBackgroundClick
        data-test-counter-report-info
        open={showDropDown}
        label="Report info"
        footer={footer}
      >
        <div id="report-info" className={reportInfoClassName}>
          <ReportInfo
            report={report}
            deleteReport={deleteReport}
            downloadRawReport={downloadRawReport}
            downloadReport={downloadReport}
            retryThreshold={maxFailedAttempts}
            udpLabel={udpLabel}
          />
        </div>
      </Modal>
      <ConfirmationModal
        open={showConfirmDelete}
        heading={<FormattedMessage id="ui-erm-usage.reportOverview.confirmDeleteReport" />}
        message={confirmMessage}
        onConfirm={doDelete}
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.yes',
        })}
        onCancel={hideConfirm}
        cancelLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.no',
        })}
      />
    </>
  );
};

ReportInfoButton.manifest = Object.freeze({
  counterReports: {
    type: 'okapi',
    fetch: false,
    accumulate: 'true',
    DELETE: {
      path: 'counter-reports',
    },
  },
});

ReportInfoButton.propTypes = {
  stripes: PropTypes.shape().isRequired,
  report: PropTypes.object,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
    csvReports: PropTypes.object,
  }),
  intl: PropTypes.object,
  maxFailedAttempts: PropTypes.number,
  udpLabel: PropTypes.string,
  handlers: PropTypes.shape({
    onDownloadReportSingleMonth: PropTypes.func,
    onDownloadReportSingleMonthRaw: PropTypes.func,
  }),
};

export default stripesConnect(injectIntl(ReportInfoButton));
