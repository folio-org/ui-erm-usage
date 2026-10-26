import saveAs from 'file-saver';

const MIME_TYPES = {
  csv: 'text/csv',
  json: 'application/json',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
};

const saveReport = (id, reportData, fileType) => {
  const blob = new Blob([reportData], { type: MIME_TYPES[fileType] ?? 'application/octet-stream' });
  const fileName = `${id}.${fileType}`;
  saveAs(blob, fileName);
};

// eslint-disable-next-line import/prefer-default-export
export { saveReport };
