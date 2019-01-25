import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ConfirmationModal,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';
import saveAs from 'file-saver';

import ReportActionMenu from '../ReportActionMenu';

class ReportButton extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      GET: {
        path: 'counter-reports/!{report.id}',
      },
      DELETE: {
        path: 'counter-reports',
      },
    }
  });

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      showDropDown: false,
      showConfirmDelete: false
    };
  }

  getFileType = (format) => {
    if (format === 'json') {
      return 'json';
    } else {
      return 'xml';
    }
  }

  getButtonStyle = (failedAttempts) => {
    if (!failedAttempts || failedAttempts === 0) {
      return 'success';
    } else if (failedAttempts < 3) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  downloadReport = () => {
    this.setState(() => ({ showDropDown: false }));
    this.props.mutator.counterReports.GET()
      .then((report) => {
        const fileType = this.getFileType(report.format);
        const blob = new Blob([report], { type: fileType });
        const fileName = `${report.id}.${fileType}`;
        saveAs(blob, fileName);
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Download of counter report failed: ' + infoText);
      });
  }

  deleteReport = () => {
    this.setState({
      showConfirmDelete: true,
      showDropDown: false
    });
  };

  doDelete = () => {
    const { report } = this.props;
    this.props.mutator.counterReports.DELETE({ id: report.id })
      .then(() => {
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.log('Delete of counter report failed: ' + infoText);
      });
    this.setState(() => ({ showConfirmDelete: false }));
  };

  hideConfirm = () => {
    this.setState({ showConfirmDelete: false });
  };

  render() {
    const { report } = this.props;
    if (_.isUndefined(report)) {
      return null;
    }

    const isFailed = (report.failedAttempts && report.failedAttempts > 0);
    const label = isFailed ? 'N' : 'Y';
    const style = this.getButtonStyle(report.failedAttempts);

    const confirmMessage = (
      <div>
        <p>Do you really want to delete this report?</p>
        <p>{`Report type: ${report.reportName} -- Report date: ${report.yearMonth}`}</p>
      </div>
    );

    return (
      <React.Fragment>
        <Dropdown
          id="report-action-dropdown"
          onToggle={() => this.setState(state => ({ showDropDown: !state.showDropDown }))}
          tether={{
            attachment: 'top left',
            targetAttachment: 'bottom left',
            targetOffset: '15px 0',
          }}
          open={this.state.showDropDown}
        >
          <Button
            id="clickable-download-stats-by-id"
            buttonStyle={style}
            data-role="toggle"
            aria-haspopup="true"
          >
            { label }
          </Button>
          <DropdownMenu
            data-role="menu"
          >
            <ReportActionMenu
              report={report}
              deleteReport={this.deleteReport}
              downloadReport={this.downloadReport}
            />
          </DropdownMenu>
        </Dropdown>
        <ConfirmationModal
          open={this.state.showConfirmDelete}
          heading="Please confirm delete!"
          message={confirmMessage}
          onConfirm={this.doDelete}
          onCancel={this.hideConfirm}
        />
      </React.Fragment>
    );
  }
}

ReportButton.propTypes = {
  stripes: PropTypes
    .shape({
      logger: PropTypes
        .shape({ log: PropTypes.func.isRequired })
        .isRequired,
    })
    .isRequired,
  report: PropTypes.object,
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
  }),
};

export default ReportButton;
