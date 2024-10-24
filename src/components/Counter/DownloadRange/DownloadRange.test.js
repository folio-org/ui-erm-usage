import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../../test/jest/helpers';

import DownloadRange from './DownloadRange';

const downloadableReports = [
  {
    value: 'DR',
    label: 'DR',
    version: 5,
  },
  {
    value: 'JR1',
    label: 'JR1',
    version: 4,
  },
];

const onDownload = jest.fn();
const handlers = {
  onDownloadReportMultiMonth: onDownload,
};

const renderDownloadRange = () => {
  return renderWithIntl(
    <DownloadRange
      downloadableReports={downloadableReports}
      udpId="e67924ee-aa00-454e-8fd0-c3f81339d20e"
      handlers={handlers}
    />
  );
};

describe('DownloadRange', () => {
  beforeEach(() => {
    renderDownloadRange();
  });

  test('happy path', async () => {
    const startInput = screen.getByLabelText('Start (Year-Month)', { exact: false });
    await userEvent.type(startInput, '2020-01');
    const endInput = screen.getByLabelText('End (Year-Month)', { exact: false });
    await userEvent.type(endInput, '2020-02');

    const reportTypeSelect = screen.getByLabelText('Report type', { exact: false });
    await userEvent.selectOptions(reportTypeSelect, ['DR']);

    const dataTypeSelect = screen.getByLabelText('Data type', { exact: false });
    await userEvent.selectOptions(dataTypeSelect, ['CSV']);

    const downloadBtn = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadBtn);
    expect(onDownload).toHaveBeenCalled();
  });
});
