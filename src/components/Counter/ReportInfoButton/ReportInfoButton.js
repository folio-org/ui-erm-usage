import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  ConfirmationModal,
  Icon,
  Modal,
} from '@folio/stripes/components';

import ReportInfo from '../ReportInfo';

class ReportInfoButton extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      DELETE: {
        path: 'counter-reports',
      },
    },
  });

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': props.stripes.okapi.tenant,
        'X-Okapi-Token': props.stripes.store.getState().okapi.token,
        'Content-Type': 'application/json',
      }
    );

    this.state = {
      showDropDown: false,
      showConfirmDelete: false,
    };
  }

  getButtonStyle = (failedAttempts) => {
    if (!failedAttempts) {
      return 'success slim';
    } else if (failedAttempts < this.props.maxFailedAttempts) {
      return 'warning slim';
    } else {
      return 'danger slim';
    }
  };

  getButtonIcon = (failedAttempts) => {
    if (!failedAttempts) {
      return <Icon icon="check-circle" />;
    } else if (failedAttempts < this.props.maxFailedAttempts) {
      return <Icon icon="exclamation-circle" />;
    } else {
      return <Icon icon="times-circle" />;
    }
  };

  downloadRawReport = (fileType) => {
    this.setState(() => ({ showDropDown: false }));
    const id = this.props.report.id;
    this.props.handlers.onDownloadReportSingleMonthRaw(id, fileType);
  };

  downloadReport = (format) => {
    this.setState(() => ({ showDropDown: false }));
    const id = this.props.report.id;
    this.props.handlers.onDownloadReportSingleMonth(id, format);
  };

  deleteReport = () => {
    this.setState({
      showConfirmDelete: true,
      showDropDown: false,
    });
  };

  doDelete = () => {
    const { report } = this.props;
    this.props.mutator.counterReports
      .DELETE({ id: report.id })
      .then(() => {})
      .catch((err) => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Delete of counter report failed: ' + infoText);
      });
    this.setState(() => ({ showConfirmDelete: false }));
  };

  hideConfirm = () => {
    this.setState({ showConfirmDelete: false });
  };

  handleClose = () => {
    this.setState({ showDropDown: false });
  };

  render() {
    const { intl, report } = this.props;
    if (_.isNil(report)) {
      return null;
    }

    const icon = this.getButtonIcon(report.failedAttempts);
    const style = this.getButtonStyle(report.failedAttempts);

    const confirmMessage = (
      <React.Fragment>
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
      </React.Fragment>
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
      <Button id="close-report-info-button" onClick={this.handleClose}>
        Close
      </Button>
    );

    return (
      <React.Fragment>
        <Button
          bottomMargin0
          aria-label={label}
          id={buttonId}
          data-testid={buttonId}
          buttonStyle={style}
          aria-haspopup="true"
          onClick={() => this.setState((state) => ({ showDropDown: !state.showDropDown }))}
        >
          {icon}
        </Button>
        <Modal
          id={dropdownId}
          closeOnBackgroundClick
          data-test-counter-report-info
          open={this.state.showDropDown}
          label="Report info"
          footer={footer}
        >
          <div id="report-info" className={reportInfoClassName}>
            <ReportInfo
              report={report}
              deleteReport={this.deleteReport}
              downloadRawReport={this.downloadRawReport}
              downloadReport={this.downloadReport}
              retryThreshold={this.props.maxFailedAttempts}
              udpLabel={this.props.udpLabel}
            />
          </div>
        </Modal>
        <ConfirmationModal
          open={this.state.showConfirmDelete}
          heading={
            <FormattedMessage id="ui-erm-usage.reportOverview.confirmDelete" />
          }
          message={confirmMessage}
          onConfirm={this.doDelete}
          confirmLabel={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.yes',
          })}
          onCancel={this.hideConfirm}
          cancelLabel={this.props.intl.formatMessage({
            id: 'ui-erm-usage.general.no',
          })}
        />
      </React.Fragment>
    );
  }
}

ReportInfoButton.propTypes = {
  stripes: PropTypes.shape().isRequired,
  report: PropTypes.object,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
    csvReports: PropTypes.object,
  }),
  intl: PropTypes.object,
  maxFailedAttempts: PropTypes.number.isRequired,
  udpLabel: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    onDownloadReportSingleMonth: PropTypes.func,
    onDownloadReportSingleMonthRaw: PropTypes.func,
  }),
};

export default stripesConnect(injectIntl(ReportInfoButton));
