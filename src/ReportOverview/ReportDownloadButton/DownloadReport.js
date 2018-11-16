import { SubmissionError } from 'redux-form';

function getContentType(format) {
  if (format === 'json') {
    return 'data:application/json';
  } else {
    return 'data:application/xml';
  }
}

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
      const contentType = getContentType(res.format);
      const fileType = getFileType(res.format);
      const anchor = document.createElement('a');
      anchor.href = `${contentType},${res.report}`;
      anchor.download = `${id}.${fileType}`;
      anchor.click();
    });
}
