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
      if (response.status !== 200) {
        throw new Error(
          `Received ${response.status} - ${response.statusText} while fetching credentials`
        );
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
      throw new Error('Error while downloading credentials: ' + err.message);
    });
};

export { downloadCredentials, saveReport };
