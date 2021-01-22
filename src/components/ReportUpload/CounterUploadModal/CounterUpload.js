import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import stripesFinalForm from '@folio/stripes/final-form';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  KeyValue,
  Loading,
  Modal,
  ModalFooter,
  Row,
  TextField,
} from '@folio/stripes/components';
import FileUploader from '../FileUploader';

class CounterUpload extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      POST: {
        path: 'counter-reports/upload/provider/!{udpId}',
      },
    },
  });

  static upload = 'upload';
  static overwrite = 'overwrite';

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
      selectedFile: {},
      showInfoModal: false,
      infoType: '',
      reportEditedManually: false,
      editReason: '',
    };
  }

  showErrorInfo = (response) => {
    response.text().then((text) => {
      if (text.includes('Report already existing')) {
        this.setState({
          showInfoModal: true,
          infoType: CounterUpload.overwrite,
        });
      } else {
        this.closeInfoModal();
        this.props.onFail(text);
      }
    });
  };

  getBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
  }

  doUpload = (file, doOverwrite) => {
    let fileBase64 = '';
    this.getBase64(file, (result) => {
      fileBase64 = result;

      const data = {
        reportMetadata: {
          reportEditedManually: this.state.reportEditedManually,
          editReason: this.state.editReason
        },
        contents: {
          data: fileBase64,
        }
      };

      const json = JSON.stringify(data);

      this.setState({
        showInfoModal: true,
        infoType: CounterUpload.upload,
      });
      fetch(
        `${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}?overwrite=${doOverwrite}`,
        {
          headers: this.httpHeaders,
          method: 'POST',
          body: json
        }
      ).then((response) => {
        if (response.status >= 400) {
          this.showErrorInfo(response);
        } else {
          this.setState({
            showInfoModal: false,
            selectedFile: {},
          });
          this.props.onSuccess();
        }
      })
        .catch((err) => {
          this.closeInfoModal();
          this.props.onFail(err.message);
        });
    });
  };

  closeInfoModal = () => {
    this.setState({
      showInfoModal: false,
      infoType: '',
    });
  };

  uploadFile = (doOverwrite = false) => {
    const selectedFile = this.state.selectedFile;
    if (!_.isEmpty(selectedFile)) {
      this.doUpload(selectedFile, doOverwrite);
    }
  };

  uploadFileForceOverwrite = () => {
    this.uploadFile(true);
  };

  selectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    this.setState({
      selectedFile: currentFile,
    });
  };

  cancleUpload = () => {
    this.closeInfoModal();
    this.props.onClose();
    this.setState({
      selectedFile: {},
      reportEditedManually: false,
      editReason: '',
    });
  }

  renderInfo = () => {
    if (this.state.infoType === CounterUpload.overwrite) {
      return (
        <>
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button id="overwriteYes" onClick={this.uploadFileForceOverwrite}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button id="overwriteNo" onClick={this.cancleUpload}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    } else if (this.state.infoType === CounterUpload.upload) {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.statistics.counter.upload.wait" />
          <Loading />
        </>
      );
    } else {
      return (
        <>
          <FormattedMessage id="ui-erm-usage.general.error" />
          <Button onClick={this.closeInfoModal}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </>
      );
    }
  };

  footer = () => (
    <ModalFooter>
      <Button id="cancel-upload-counter-report" onClick={this.cancleUpload}>
        <FormattedMessage id="ui-erm-usage.general.cancel" />
      </Button>
    </ModalFooter>
  );

  changeReportEditedManually = () => {
    this.setState(prevState => ({ reportEditedManually: !prevState.reportEditedManually }));
  };

  changeEditReason = event => {
    this.setState({ editReason: event.target.value });
  };

  render() {
    const reportEditedManually = this.state.reportEditedManually;
    let disableUploadButton = true;
    if ((this.state.reportEditedManually === true && this.state.editReason !== '') || (this.state.reportEditedManually === false && this.state.editReason === '')) {
      disableUploadButton = false;
    }

    return (
      <form
        data-test-counter-report-form-page
        id="form-counter-report"
      >
        <Modal
          closeOnBackgroundClick
          footer={this.footer()}
          id="upload-counter-modal"
          open={this.props.open}
          label={this.props.intl.formatMessage({ id:'ui-erm-usage.statistics.counter.upload' })}
        >
          <div className="upload-counter-modal-div">
            <Row>
              <Col xs={8}>
                <Row>
                  <KeyValue
                    label={<FormattedMessage id="ui-erm-usage.general.info" />}
                    value={<FormattedMessage id="ui-erm-usage.report.upload.info" />}
                  />
                </Row>
                <Row>
                  <Col xs={12}>
                    <FileUploader
                      onSelectFile={this.selectFile}
                      selectedFile={this.state.selectedFile}
                      onClickUpload={this.uploadFile}
                      disable={disableUploadButton}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={4}>
                <Row style={{ 'marginTop': '25px' }}>
                  <Field
                    component={Checkbox}
                    id="addcounterreport_reportEditedManually"
                    initialValue={false}
                    label={<FormattedMessage id="ui-erm-usage.report.upload.editedManually" />}
                    name="reportEditedManually"
                    onChange={this.changeReportEditedManually}
                    checked={this.state.reportEditedManually}
                    type="checkbox"
                  />
                </Row>
                <Row style={{ 'marginTop': '15px' }}>
                  <Field
                    component={TextField}
                    disabled={!reportEditedManually}
                    fullWidth
                    initialValue=""
                    id="addcounterreport_editReason"
                    label={<FormattedMessage id="ui-erm-usage.report.upload.editReason" />}
                    name="editReason"
                    onChange={this.changeEditReason}
                    placeholder={this.props.intl.formatMessage({ id: 'ui-erm-usage.report.upload.editReason.placeholder' })}
                    required={reportEditedManually}
                  />
                </Row>
              </Col>
            </Row>
            <Modal
              open={this.state.showInfoModal}
              label={this.props.intl.formatMessage({
                id: 'ui-erm-usage.report.upload.modal.label',
              })}
              id="counterReportExists"
            >
              {this.renderInfo()}
            </Modal>
          </div>
        </Modal>
      </form>
    );
  }
}

CounterUpload.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string,
  intl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(stripesConnect(stripesFinalForm({
  enableReinitialize: true,
})(CounterUpload)));
