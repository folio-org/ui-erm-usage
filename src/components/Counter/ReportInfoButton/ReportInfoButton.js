import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Button,
  ConfirmationModal,
  Icon,
  Modal,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import extractErrorCode from '../../../util/extractErrorCode';
import ReportInfo from '../ReportInfo';
import css from './ReportInfoButton.css';

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
    if (report.failedReason && errorCode === '3030') {
      return {
        buttonStyle: 'success slim',
        icon: <Icon icon="default" />,
      };
    } else if (report.failedReason && errorCode === '3031') {
      return {
        buttonStyle: 'slim',
        buttonClass: css.yellow,
        icon: <Icon icon="calendar" />,
      };
    } else if (report.failedReason && errorCode === '3032') {
      return {
        buttonStyle: 'danger slim',
        icon: <Icon icon="calendar" />,
      };
    } else if (!failedAttempts && report?.reportEditedManually) {
      return {
        buttonStyle: 'success slim',
        icon: <Icon icon="edit" />,
      };
    } else if (!failedAttempts) {
      return {
        buttonStyle: 'success slim',
        icon: <Icon icon="check-circle" />,
      };
    } else if (failedAttempts < maxFailedAttempts) {
      return {
        buttonStyle: 'warning slim',
        icon: <Icon icon="exclamation-circle" />,
      };
    } else {
      return {
        buttonStyle: 'danger slim',
        icon: <Icon icon="times-circle" />,
      };
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

  const error = report.failedReason ? extractErrorCode(report.failedReason) : null;
  const { buttonStyle, buttonClass = '', icon } = getButtonStyle(report.failedAttempts, error?.code);

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
        aria-haspopup="true"
        aria-label={label}
        bottomMargin0
        buttonClass={buttonClass}
        buttonStyle={buttonStyle}
        data-testid={buttonId}
        id={buttonId}
        onClick={() => setShowDropDown(curState => !curState)}
      >
        {icon}
      </Button>
      <Modal
        closeOnBackgroundClick
        data-test-counter-report-info
        footer={footer}
        id={dropdownId}
        label="Report info"
        open={showDropDown}
      >
        <div className={reportInfoClassName} id="report-info">
          <ReportInfo
            deleteReport={deleteReport}
            downloadRawReport={downloadRawReport}
            downloadReport={downloadReport}
            report={report}
            retryThreshold={maxFailedAttempts}
            udpLabel={udpLabel}
          />
        </div>
      </Modal>
      <ConfirmationModal
        cancelLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.no',
        })}
        confirmLabel={intl.formatMessage({
          id: 'ui-erm-usage.general.yes',
        })}
        heading={<FormattedMessage id="ui-erm-usage.reportOverview.confirmDeleteReport" />}
        message={confirmMessage}
        onCancel={hideConfirm}
        onConfirm={doDelete}
        open={showConfirmDelete}
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
  handlers: PropTypes.shape({
    onDownloadReportSingleMonth: PropTypes.func,
    onDownloadReportSingleMonthRaw: PropTypes.func,
  }),
  intl: PropTypes.object,
  maxFailedAttempts: PropTypes.number,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
    csvReports: PropTypes.object,
  }),
  report: PropTypes.object,
  stripes: PropTypes.shape().isRequired,
  udpLabel: PropTypes.string,
};

export default stripesConnect(injectIntl(ReportInfoButton));
