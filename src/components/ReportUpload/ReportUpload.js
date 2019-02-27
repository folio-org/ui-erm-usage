import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import FileUploader from './FileUploader';

class ReportUpload extends React.Component {
  static manifest = Object.freeze({
    counterReports: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      POST: {
        path: 'counter-reports/upload/provider/!{udpId}'
      }
    }
  });

  static propTypes = {
    stripes: PropTypes.shape().isRequired,
    udpId: PropTypes.string,
    mutator: PropTypes.shape({
      counterReports: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/octet-stream'
    });
    this.state = {
      selectedFile: {},
    };
  }

  doUpload = (data) => {
    fetch(`${this.okapiUrl}/counter-reports/upload/provider/${this.props.udpId}`,
      {
        headers: this.httpHeaders,
        method: 'POST',
        body: data
      })
      .then((response) => {
        if (response.status >= 400) {
          throw new SubmissionError({ identifier: `Error ${response.status} retrieving counter csv report by id`, _error: 'Fetch counter csv failed' });
        } else {
          this.setState({ selectedFile: {} });
          return response.text();
        }
      });
  }

  uploadFile = () => {
    const selectedFile = this.state.selectedFile;
    if (!_.isEmpty(selectedFile)) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.doUpload(event.target.result);
      };
      fileReader.readAsText(selectedFile);
    }
  }

  selectFile = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    this.setState({
      selectedFile: currentFile,
    });
  }

  render() {
    return (
      <React.Fragment>
        <FileUploader
          onSelectFile={this.selectFile}
          selectedFile={this.state.selectedFile}
          onClickUpload={this.uploadFile}
        />
      </React.Fragment>
    );
  }
}

export default ReportUpload;
