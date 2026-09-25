import saveAs from 'file-saver';

import { saveReport } from './downloadReport';

jest.mock('file-saver');

saveAs.mockImplementation(jest.fn());

describe('saveReport', () => {
  it('saves report data as file named by id and file type', () => {
    const format = 'csv';
    const content = 'csv content';

    saveReport('123', content, format);
    expect(saveAs).toHaveBeenCalledWith(
      new Blob([content], { type: format }),
      `123.${format}`
    );
  });
});
