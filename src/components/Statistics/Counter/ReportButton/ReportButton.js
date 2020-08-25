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
import {
  downloadReportSingleMonth,
  downloadReportSingleMonthRaw,
} from '../../../../util/downloadReport';

class ReportButton extends React.Component {
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
      return 'success';
    } else if (failedAttempts < this.props.maxFailedAttempts) {
      return 'warning';
    } else {
      return 'danger';
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
    downloadReportSingleMonthRaw(
      id,
      fileType,
      this.okapiUrl,
      this.httpHeaders
    ).catch((err) => {
      this.log(err.message);
    });
  };

  downloadReport = (format) => {
    this.setState(() => ({ showDropDown: false }));
    const id = this.props.report.id;
    downloadReportSingleMonth(
      id,
      format,
      this.okapiUrl,
      this.httpHeaders
    ).catch((err) => {
      this.log(err.message);
    });
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
    const { report } = this.props;
    if (_.isUndefined(report)) {
      return null;
    }

    const icon = this.getButtonIcon(report.failedAttempts);
    const style = this.getButtonStyle(report.failedAttempts);

    const confirmMessage = (
      <React.Fragment>
        <span>
          Do you really want to delete this report?
          <br />
        </span>
        <span>
          {`${this.props.intl.formatMessage({
            id: 'ui-erm-usage.reportOverview.reportType',
          })}:
           ${report.reportName} --
           ${this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.reportDate' })}:
           ${report.yearMonth}`}
        </span>
      </React.Fragment>
    );

    const buttonId = `clickable-download-stats-by-id-${report.reportName}-${report.yearMonth}`;
    const dropdownId = `report-info-${report.reportName}-${report.yearMonth}`;
    const failedInfo = report.failedAttempts
      ? 'There are harvesting errors for this report.'
      : 'Harvesting was successfull.';
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
          aria-label={label}
          id={buttonId}
          buttonStyle={style}
          data-role="toggle"
          aria-haspopup="true"
          onClick={() =>
            this.setState((state) => ({ showDropDown: !state.showDropDown }))
          }
        >
          {icon}
        </Button>
        <Modal
          id={dropdownId}
          closeOnBackgroundClick
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

ReportButton.propTypes = {
  stripes: PropTypes.shape().isRequired,
  report: PropTypes.object,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
    csvReports: PropTypes.object,
  }),
  intl: PropTypes.object,
  maxFailedAttempts: PropTypes.number.isRequired,
  udpLabel: PropTypes.string.isRequired,
};

export default stripesConnect(injectIntl(ReportButton));
