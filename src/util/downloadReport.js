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
  httpHeaders,
  callout,
  intl
) => {
  const calloutID = callout.current.sendCallout({
    type: 'success',
    message: intl.formatMessage(
      { id: 'ui-erm-usage.statistics.counter.download.multiMonth.prepare' },
      { reportName, start, end, format }
    ),
    timeout: 0,
  });

  const errorMsg = intl.formatMessage(
    { id: 'ui-erm-usage.statistics.counter.download.multiMonth.error' },
    { reportName, start, end, format }
  );
  return fetch(
    `${okapiUrl}/counter-reports/export/provider/${udpId}/report/${reportName}/version/${version}/from/${start}/to/${end}?format=${format}`,
    { headers: httpHeaders }
  )
    .then((response) => {
      callout.current.removeCallout(calloutID);
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving report for multiple months`,
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
      callout.current.sendCallout({
        type: 'error',
        message: errorMsg,
        timeout: 0,
      });
      throw new SubmissionError({
        identifier: `Error ${err} retrieving counter report for multiple months`,
        _error: 'Fetch counter report failed',
      });
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
      throw new Error(
        'Error while downloading CSV/xslx report. ' + err.message
      );
    });
};

const downloadReportSingleMonthRaw = (
  reportId,
  fileType,
  okapiUrl,
  httpHeaders
) => {
  return fetch(`${okapiUrl}/counter-reports/${reportId}/download`, {
    headers: httpHeaders,
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} downloading counter report by id`,
          _error: 'Fetch counter csv failed',
        });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      saveReport(reportId, text, fileType);
    })
    .catch((err) => {
      throw new Error(
        'Error while downloading xml/json report. ' + err.message
      );
    });
};

const downloadCredentials = (aggregatorId, format, okapiUrl, httpHeaders) => {
  return fetch(
    `${okapiUrl}/aggregator-settings/${aggregatorId}/exportcredentials?format=${format}`,
    { headers: httpHeaders }
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

const downloadErmUsageFile = (fileId, fileName, okapiUrl, httpHeaders) => {
  return fetch(`${okapiUrl}/erm-usage/files/${fileId}`, {
    headers: httpHeaders,
  })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving file`,
          _error: 'Fetch file failed',
        });
      } else {
        return response.text();
      }
    })
    .then((text) => {
      const blob = new Blob([text]);
      saveAs(blob, fileName);
    })
    .catch((err) => {
      throw new Error('Error while downloading file. ' + err.message);
    });
};

export {
  downloadErmUsageFile,
  downloadReportMultipleMonths,
  downloadCredentials,
  downloadReportSingleMonth,
  downloadReportSingleMonthRaw,
};
