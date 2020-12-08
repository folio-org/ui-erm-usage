import _ from 'lodash';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  KeyValue,
  Loading,
  Modal,
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

  static propTypes = {
    onSuccess: PropTypes.func,
    onFail: PropTypes.func,
    stripes: PropTypes.shape().isRequired,
    udpId: PropTypes.string,
    mutator: PropTypes.shape({
      counterReports: PropTypes.object,
    }),
    intl: PropTypes.object,
  };

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
          this.showErrorInfo(response);
        } else {
          this.closeInfoModal();
          this.setState({
            selectedFile: {},
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

  uploadFile = (doOverwrite = false) => {
    const selectedFile = this.state.selectedFile;
    if (!_.isEmpty(selectedFile)) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.doUpload(event.target.result, doOverwrite);
      };
      fileReader.readAsText(selectedFile);
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
          <Button onClick={this.closeInfoModal}>
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

  render() {
    return (
      <React.Fragment>
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
                />
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            <Field
              component={Checkbox}
              label="Report data has been edited manually"
              name="reportEditedManually"
              type="checkbox"
            />
            <Field
              component={TextField}
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
          {this.renderInfo()}
        </Modal>
      </React.Fragment>
    );
  }
}

export default stripesConnect(injectIntl(CounterUpload));
