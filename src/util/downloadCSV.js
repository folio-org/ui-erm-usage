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
        throw new SubmissionError({ identifier: `Error ${response.status} retrieving counter csv report for multiple mpnths`, _error: 'Fetch counter csv failed' });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const fileType = 'csv';
      saveReport(`${udpId}_${reportName}_${version}_${start}_${end}`, text, fileType);
    })
    .catch(err => {
      throw new Error('Error while downloading CSV report. ' + err.message);
    });
};

const downloadCSVSingleMonth = (udpId, okapiUrl, httpHeaders) => {
  return fetch(`${okapiUrl}/counter-reports/csv/${udpId}`, { headers: httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ identifier: `Error ${response.status} retrieving counter csv report by id`, _error: 'Fetch counter csv failed' });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const fileType = 'csv';
      saveReport(udpId, text, fileType);
    })
    .catch(err => {
      throw new Error('Error while downloading CSV report. ' + err.message);
    });
};

const downloadCredentials = (aggregatorId, okapiUrl, httpHeaders) => {
  return fetch(`${okapiUrl}/aggregator-settings/${aggregatorId}/exportcredentials`, { headers: httpHeaders })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ identifier: `Error ${response.status} retrieving credentials of aggregator`, _error: 'Fetch credentials failed' });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const fileType = 'csv';
      saveReport(aggregatorId, text, fileType);
    })
    .catch(err => {
      throw new Error('Error while downloading credentials. ' + err.message);
    });
};

export { downloadCSVMultipleMonths, downloadCSVSingleMonth, downloadCredentials };
