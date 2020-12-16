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
        'Content-Type': 'application/octet-stream',
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

  doUpload = (data, doOverwrite) => {
    // TODO:
    // Schleife für reports über mehrere Jahre
    // wenn upload fertig, infoModal schließen
    // console.log(data);

    this.setState({
      showInfoModal: true,
      infoType: CounterUpload.upload,
    });
    fetch(
      `${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}?overwrite=${doOverwrite}`,
      {
        headers: this.httpHeaders,
        method: 'POST',
        body: data,
      }
    )
      .then((response) => {
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
      <Button buttonStyle="primary" disabled={!this.state.enableSubmit || this.props.pristine} onClick={onSubmit}>
        Save
      </Button>
      <Button onClick={this.props.onClose}>Cancel</Button>
    </ModalFooter>
  );

  render() {
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
                <Field
                  component={Checkbox}
                  initialValue={false}
                  label="Report data has been edited manually"
                  name="reportEditedManually"
                  type="checkbox"
                />
                <Field
                  component={TextField}
                  initialValue=""
                  fullWidth
                  id="addcounterreport_editReason"
                  label="Edit reason"
                  name="editReason"
                  placeholder="Enter reason for manual changes"
                />
              </Col>
            </Row>
            <Modal
              open={this.state.showInfoModal}
              label={this.props.intl.formatMessage({
                id: 'ui-erm-usage.report.upload.modal.label',
              })}
            >
              {/* Report exists. Do you want to overwrite? */}
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
  mutators: PropTypes.shape({
    setEditReason: PropTypes.func,
  }),
  intl: PropTypes.object,
  parentCallback: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
};

export default injectIntl(stripesConnect(stripesFinalForm({
  mutators: {
    setEditReason: (args, state, tools) => {
      tools.changeValue(state, 'editReason', () => args[1]);
    }
  },
})(CounterUpload)));
