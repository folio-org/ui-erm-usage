import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {
  Button
} from '@folio/stripes/components';

class FileUploader extends React.Component {
  static propTypes = {
    onSelectFile: PropTypes.func.isRequired,
    onClickUpload: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.props.onSelectFile(acceptedFiles);
  }

  renderDownloadButton = () => {
    if (_.isEmpty(this.props.selectedFile)) {
      return null;
    } else {
      return (
        <Button
          buttonStyle="primary"
          onClick={() => this.props.onClickUpload()}
        >
          { `Upload ${this.props.selectedFile.name}` }
        </Button>
      );
    }
  }

  render() {
    const baseStyle = {
      'display': 'flex',
      'align-items': 'center',
      'flex-direction': 'column',
      'justify-content': 'center',
      'height': '100%',
      'borderWidth': '2',
      'borderColor': '#666',
      'borderStyle': 'dashed',
      'borderRadius': '5'
    };

    const style = { ...baseStyle };
    return (
      <Dropzone
        onDrop={this.onDrop}
        multiple={false}
      >
        {({ getRootProps, getInputProps, open }) => (
          <div {...getRootProps({ onClick: evt => evt.preventDefault() })}>
            <div style={style}>
              <input {...getInputProps()} />
              <p>Drop file here</p>
              <Button
                buttonStyle="primary"
                onClick={() => open()}
              >
                or select file
              </Button>
              { this.renderDownloadButton() }
            </div>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default FileUploader;
