import saveAs from 'file-saver';

import { saveReport } from './downloadReport';

jest.mock('file-saver');

saveAs.mockImplementation(jest.fn());

describe('saveReport', () => {
  beforeEach(() => {
    saveAs.mockClear();
  });

  it.each([
    ['csv', 'text/csv'],
    ['json', 'application/json'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['xml', 'application/xml'],
  ])('saves %s report data as file named by id with MIME type %s', (fileType, mimeType) => {
    saveReport('123', 'content', fileType);

    const [blob, fileName] = saveAs.mock.calls[0];
    expect(blob.type).toBe(mimeType);
    expect(fileName).toBe(`123.${fileType}`);
  });

  it('falls back to a generic MIME type for other file types', () => {
    saveReport('123', 'content', 'foo');

    const [blob, fileName] = saveAs.mock.calls[0];
    expect(blob.type).toBe('application/octet-stream');
    expect(fileName).toBe('123.foo');
  });
});
