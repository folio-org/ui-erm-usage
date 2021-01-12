import _ from 'lodash';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import stripesFinalForm from '@folio/stripes/final-form';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  KeyValue,
  Loading,
  Label,
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
      enableSubmit: false,
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
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  doUpload = (file, doOverwrite) => {
    const blob = new Blob([JSON.stringify(file, null, 2)], { type : 'application/json' });
    let fileBase64 = '';
    this.getBase64(blob, (result) => {
      fileBase64 = result;

      const data = {
        reportMetadata: {
          reportEditedManually: true,
          editReason: 'this is a reason'
        },
        contents: fileBase64,
      };

      const json = JSON.stringify(data);

      fetch(
        `${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}?overwrite=${doOverwrite}`,
        {
          headers: this.httpHeaders,
          method: 'POST',
          body: json
        }
      ).then((response) => {
        if (response.status >= 400) {
          this.setState({
            enableSubmit: false,
          });
          this.showErrorInfo(response);
        } else {
          response.text().then(text => {
            const reportId = text.replace('Saved report with ids: ', '');
            this.props.parentCallback(reportId);
          });

          this.setState({
            enableSubmit: true,
            showInfoModal: false,
          });
          this.props.onSuccess();
        }
      })
        .catch((err) => {
          this.closeInfoModal();
          this.props.onFail(err.message);
        });
    });


    // const testData = {
    //   reportMetadata: {
    //     reportEditedManually: true,
    //     editReason: 'this is a reason'
    //   },
    //   contents: fileBase64,
    // };
    // const json = JSON.stringify(testData);
    this.setState({
      showInfoModal: true,
      infoType: CounterUpload.upload,
    });
    // fetch(
    //   `${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}?overwrite=${doOverwrite}`,
    //   {
    //     headers: this.httpHeaders,
    //     method: 'POST',
    //     body: json
    //   }
    // )
    //   .then((response) => {
    //     if (response.status >= 400) {
    //       this.setState({
    //         enableSubmit: false,
    //       });
    //       this.showErrorInfo(response);
    //     } else {
    //       response.text().then(text => {
    //         const reportId = text.replace('Saved report with ids: ', '');
    //         this.props.parentCallback(reportId);
    //       });

    //       this.setState({
    //         enableSubmit: true,
    //         showInfoModal: false,
    //       });
    //       this.props.onSuccess();
    //     }
    //   })
    //   .catch((err) => {
    //     this.closeInfoModal();
    //     this.props.onFail(err.message);
    //   });
  };

  closeInfoModal = () => {
    this.setState({
      showInfoModal: false,
      infoType: '',
    });
  };

  uploadFile = (file, doOverwrite = false) => {
    if (!_.isEmpty(file)) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.doUpload(event.target.result, doOverwrite);
      };
      fileReader.readAsText(file);
    }
  };

  uploadFileForceOverwrite = () => {
    this.uploadFile(this.state.selectedFile, true);
  };

  selectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    this.setState({
      selectedFile: currentFile,
    });
    this.uploadFile(currentFile);
  };

  cancleUpload = () => {
    this.closeInfoModal();
    this.setState({
      selectedFile: {},
    });
  }

  renderInfo = () => {
    if (this.state.infoType === CounterUpload.overwrite) {
      return (
        <>
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button onClick={this.uploadFileForceOverwrite}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button onClick={this.cancleUpload}>
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

  renderSelectedFile = () => {
    let selectedText = '';
    const fileName = _.get(this.state.selectedFile, 'name', '');
    if (fileName === '') {
      selectedText = (
        <FormattedMessage id="ui-erm-usage.statistics.custom.selectFileFirst" />
      );
    } else {
      selectedText = fileName;
    }
    return (
      <KeyValue
        label={
          <Label required>
            <FormattedMessage id="ui-erm-usage.statistics.custom.selectedFile" />
          </Label>
        }
        value={selectedText}
      />
    );
  };

  footer = (onSubmit) => (
    <ModalFooter>
      <Button buttonStyle="primary" disabled={!this.state.enableSubmit || this.props.pristine || this.props.invalid} onClick={onSubmit}>
        Save
      </Button>
      <Button onClick={this.props.onClose}>Cancel</Button>
    </ModalFooter>
  );

  render() {
    const reportEditedManually = this.props.values.reportEditedManually;

    return (
      <form
        data-test-counter-report-form-page
        id="form-counter-report"
        onSubmit={this.props.handleSubmit}
      >
        <Modal
          closeOnBackgroundClick
          footer={this.footer(this.props.handleSubmit)}
          open={this.props.open}
          label={<FormattedMessage id="ui-erm-usage.statistics.counter.upload" />}
        >
          <div className="upload-counter-modal">
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
                    />
                  </Col>
                </Row>
                <Row style={{ 'marginTop': '25px' }}>
                  <Col xs={10}>{this.renderSelectedFile()}</Col>
                </Row>
              </Col>
              <Col xs={4}>
                <Row style={{ 'marginTop': '25px' }}>
                  <Field
                    component={Checkbox}
                    initialValue={false}
                    label={<FormattedMessage id="ui-erm-usage.report.upload.editedManually" />}
                    name="reportEditedManually"
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
                    placeholder={this.props.intl.formatMessage({ id: 'ui-erm-usage.report.upload.editReason.placeholder' })}
                    required
                  />
                </Row>
              </Col>
            </Row>
            <Modal
              open={this.state.showInfoModal}
              label={this.props.intl.formatMessage({
                id: 'ui-erm-usage.report.upload.modal.label',
              })}
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
  mutator: PropTypes.shape({
    counterReports: PropTypes.object,
  }),
  intl: PropTypes.object,
  parentCallback: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  values: PropTypes.shape(),
};

export default injectIntl(stripesConnect(stripesFinalForm({
  enableReinitialize: true,
  subscription: {
    values: true,
    invalid: true,
  },
  validate: (values) => {
    const errors = {};
    if (!values.editReason) {
      errors.editReason = 'Required';
    }
    return errors;
  },
})(CounterUpload)));
