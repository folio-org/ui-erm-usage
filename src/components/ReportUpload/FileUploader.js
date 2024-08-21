import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Button } from '@folio/stripes/components';

const FileUploader = ({ onChange }) => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    borderWidth: '2',
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: '5',
  };

  return (
    <Dropzone noClick onDrop={(acceptedFiles) => onChange(acceptedFiles[0])} multiple={false}>
      {({ getRootProps, getInputProps, open }) => (
        <div {...getRootProps()} style={style}>
          <input {...getInputProps()} data-testid="fileInput" />
          <FormattedMessage id="ui-erm-usage.report.upload.dropFile" />
          <Button buttonStyle="primary" onClick={() => open()}>
            <FormattedMessage id="ui-erm-usage.report.upload.selectFile" />
          </Button>
        </div>
      )}
    </Dropzone>
  );
};

FileUploader.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FileUploader;
