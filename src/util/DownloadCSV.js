import { SubmissionError } from 'redux-form';
import saveAs from 'file-saver';

const saveReport = (id, reportData, fileType) => {
  const blob = new Blob([reportData], { type: fileType });
  const fileName = `${id}.${fileType}`;
  saveAs(blob, fileName);
};

const downloadCSVMultipleMonths = (udpId, reportName, version, start, end, okapiUrl, httpHeaders) => {
  return fetch(`${okapiUrl}/counter-reports/csv/provider/${udpId}/report/${reportName}/version/${version}/from/${start}/to/${end}`, { headers: httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ identifier: `Error ${response.status} retrieving counter csv report by id`, _error: 'Fetch counter csv failed' });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const fileType = 'csv';
      saveReport(udpId + start + end, text, fileType);
    })
    .catch(err => {
      const infoText = 'Error while downloading CSV report. ' + err.message;
      this.log('Download of counter csv report failed: ' + infoText);
    });
};

const downloadCSVSingleMonth = (udpId) => {
  console.log(udpId);
};

export { downloadCSVMultipleMonths, downloadCSVSingleMonth };
