import { SubmissionError } from 'redux-form';
import saveAs from 'file-saver';

function getFileType(format) {
  if (format === 'json') {
    return 'json';
  } else {
    return 'xml';
  }
}

export default function downloadReport(id, okapiUrl, header) {
  const url = `${okapiUrl}/counter-reports/${id}`;
  return fetch(url, { headers: header })
    .then((response) => {
      if (response.status >= 400) {
        throw new SubmissionError({ identifier: `Error ${response.status} downloading counter report by id`, _error: 'Fetch report failed' });
      } else {
        return response.json();
      }
    })
    .then((res) => {
      const data = res.report;
      const fileType = getFileType(res.format);
      const blob = new Blob([data], { type: fileType });
      const fileName = `${id}.${fileType}`;
      saveAs(blob, fileName);
    });
}
