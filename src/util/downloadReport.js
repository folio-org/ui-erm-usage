import { SubmissionError } from 'redux-form';
import saveAs from 'file-saver';
import fetchWithDefaultOptions from './fetchWithDefaultOptions';

const saveReport = (id, reportData, fileType) => {
  const blob = new Blob([reportData], { type: fileType });
  const fileName = `${id}.${fileType}`;
  saveAs(blob, fileName);
};

const downloadCredentials = (aggregatorId, format, okapi, httpHeaders) => {
  return fetchWithDefaultOptions(
    okapi,
    `/aggregator-settings/${aggregatorId}/exportcredentials?format=${format}`,
    {
      headers: httpHeaders,
    }
  )
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving credentials of aggregator`,
          _error: 'Fetch credentials failed',
        });
      } else {
        if (format === 'csv') {
          return response.text();
        }
        return response.blob();
      }
    })
    .then((text) => {
      saveReport(aggregatorId, text, format);
    })
    .catch((err) => {
      throw new Error('Error while downloading credentials. ' + err.message);
    });
};

export { downloadCredentials, saveReport };
