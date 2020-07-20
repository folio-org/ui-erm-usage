import _ from 'lodash';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Col, KeyValue, Modal, Row } from '@folio/stripes/components';
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
      showOverwriteModal: false,
    };
  }

  showErrorInfo = (response) => {
    response.text().then((text) => {
      if (text.includes('Report already existing')) {
        this.setState({
          showOverwriteModal: true,
        });
      } else {
        this.setState({
          showOverwriteModal: false,
        });
        this.props.onFail();
      }
    });
  };

  doUpload = (data, doOverwrite) => {
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
          this.setState({
            showOverwriteModal: false,
            selectedFile: {},
          });
          this.props.onSuccess();
        }
      })
      .catch((err) => {
        this.setState({
          showOverwriteModal: false,
        });
        this.props.onFail(err.message);
      });
  };

  handleCloseOverwriteModal = () => {
    this.setState({ showOverwriteModal: false });
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

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs={8}>
            <KeyValue
              label={<FormattedMessage id="ui-erm-usage.general.info" />}
              value={<FormattedMessage id="ui-erm-usage.report.upload.info" />}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <FileUploader
              onSelectFile={this.selectFile}
              selectedFile={this.state.selectedFile}
              onClickUpload={this.uploadFile}
            />
          </Col>
        </Row>
        <Modal
          closeOnBackgroundClick
          open={this.state.showOverwriteModal}
          label={this.props.intl.formatMessage({
            id: 'ui-erm-usage.report.upload.modal.label',
          })}
        >
          <div>
            <FormattedMessage id="ui-erm-usage.report.upload.reportExists" />
          </div>
          <Button onClick={this.uploadFileForceOverwrite}>
            <FormattedMessage id="ui-erm-usage.general.yes" />
          </Button>
          <Button onClick={this.handleCloseOverwriteModal}>
            <FormattedMessage id="ui-erm-usage.general.no" />
          </Button>
        </Modal>
      </React.Fragment>
    );
  }
}

export default stripesConnect(injectIntl(CounterUpload));
