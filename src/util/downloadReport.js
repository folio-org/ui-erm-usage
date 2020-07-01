import { SubmissionError } from 'redux-form';
import saveAs from 'file-saver';

const saveReport = (id, reportData, fileType) => {
  const blob = new Blob([reportData], { type: fileType });
  const fileName = `${id}.${fileType}`;
  saveAs(blob, fileName);
};

const downloadReportMultipleMonths = (
  udpId,
  reportName,
  version,
  start,
  end,
  format,
  okapiUrl,
  httpHeaders
) => {
  return fetch(
    `${okapiUrl}/counter-reports/export/provider/${udpId}/report/${reportName}/version/${version}/from/${start}/to/${end}?format=${format}`,
    { headers: httpHeaders }
  )
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving counter report for multiple mpnths`,
          _error: 'Fetch counter report failed',
        });
      } else {
        if (format === 'csv') {
          return response.text();
        }
        return response.blob();
      }
    })
    .then((text) => {
      saveReport(
        `${udpId}_${reportName}_${version}_${start}_${end}`,
        text,
        format
      );
    })
    .catch((err) => {
      throw new Error('Error while downloading CSV/xslx report. ' + err.message);
    });
};

const downloadReportSingleMonth = (udpId, format, okapiUrl, httpHeaders) => {
  return fetch(`${okapiUrl}/counter-reports/export/${udpId}?format=${format}`, {
    headers: httpHeaders,
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving counter report by id`,
          _error: 'Fetch counter csv failed',
        });
      } else {
        if (format === 'csv') {
          return response.text();
        }
        return response.blob();
      }
    })
    .then((text) => {
      saveReport(udpId, text, format);
    })
    .catch((err) => {
      throw new Error('Error while downloading CSV/xslx report. ' + err.message);
    });
};

const downloadCredentials = (aggregatorId, okapiUrl, httpHeaders) => {
  return fetch(
    `${okapiUrl}/aggregator-settings/${aggregatorId}/exportcredentials`,
    { headers: httpHeaders }
  )
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving credentials of aggregator`,
          _error: 'Fetch credentials failed',
        });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const fileType = 'csv';
      saveReport(aggregatorId, text, fileType);
    })
    .catch((err) => {
      throw new Error('Error while downloading credentials. ' + err.message);
    });
};

export {
  downloadReportMultipleMonths,
  downloadCredentials,
  downloadReportSingleMonth,
};
