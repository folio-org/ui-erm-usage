import saveAs from 'file-saver';
import { downloadCredentials } from './downloadReport';
import fetchWithDefaultOptions from './fetchWithDefaultOptions';

jest.mock('./fetchWithDefaultOptions');
jest.mock('file-saver');

const aggregatorId = '123';
global.URL.createObjectURL = jest.fn();
saveAs.mockImplementation(jest.fn());

describe('downloadCredentials && saveReport', () => {
  it('download credentials in csv format', async () => {
    const format = 'csv';
    const content = 'csv content';

    fetchWithDefaultOptions.mockResolvedValue({
      status: 200,
      text: jest.fn().mockResolvedValue(content),
    });

    await downloadCredentials(aggregatorId, format, {}, {});
    expect(saveAs).toHaveBeenCalledWith(
      new Blob([content], { type: format }),
      `${aggregatorId}.${format}`
    );
  });

  it('download credentials in xlsx format', async () => {
    const format = 'xlsx';
    const content = 'binary content';

    fetchWithDefaultOptions.mockResolvedValue({
      status: 200,
      blob: jest.fn().mockResolvedValue(content),
    });

    await downloadCredentials(aggregatorId, format, {}, {});
    expect(saveAs).toHaveBeenCalledWith(
      new Blob([content], { type: format }),
      `${aggregatorId}.${format}`
    );
  });

  it('handle error while downloading credentials', async () => {
    fetchWithDefaultOptions.mockResolvedValue({ status: 404, statusText: 'Not Found' });

    await expect(downloadCredentials(aggregatorId, 'csv', {}, {})).rejects.toThrow(
      /Error while downloading.*404 - Not Found.*/
    );
  });
});
