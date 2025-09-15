import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../../test/jest/helpers';

import DownloadRange from './DownloadRange';

const downloadableReports = [
  {
    value: 'JR1',
    label: 'JR1',
    release: '4',
  },
  {
    value: 'DR',
    label: 'DR',
    release: '5',
  },
  {
    value: 'TR',
    label: 'TR',
    release: '5.1',
  },
];

const onDownloadReportMultiMonth = jest.fn();

const renderDownloadRange = () => {
  return renderWithIntl(
    <DownloadRange
      downloadableReports={downloadableReports}
      udpId="e67924ee-aa00-454e-8fd0-c3f81339d20e"
      onDownloadReportMultiMonth={onDownloadReportMultiMonth}
    />
  );
};

describe('DownloadRange', () => {
  beforeEach(() => {
    renderDownloadRange();
  });

  test('downloadReportMultipleMonths DR (5)', async () => {
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
    expect(onDownloadReportMultiMonth).toHaveBeenCalled();

    expect(onDownloadReportMultiMonth).toHaveBeenCalledWith(
      'e67924ee-aa00-454e-8fd0-c3f81339d20e',
      'DR',
      '5',
      '2020-01',
      '2020-02',
      'csv',
    );
  });

  test('downloadReportMultipleMonths TR (5.1)', async () => {
    const startInput = screen.getByLabelText('Start (Year-Month)', { exact: false });
    await userEvent.type(startInput, '2020-01');
    const endInput = screen.getByLabelText('End (Year-Month)', { exact: false });
    await userEvent.type(endInput, '2020-02');

    const reportTypeSelect = screen.getByLabelText('Report type', { exact: false });
    await userEvent.selectOptions(reportTypeSelect, ['TR']);

    const dataTypeSelect = screen.getByLabelText('Data type', { exact: false });
    await userEvent.selectOptions(dataTypeSelect, ['XLSX']);

    const downloadBtn = screen.getByRole('button', { name: 'Download' });
    await userEvent.click(downloadBtn);
    expect(onDownloadReportMultiMonth).toHaveBeenCalled();

    expect(onDownloadReportMultiMonth).toHaveBeenCalledWith(
      'e67924ee-aa00-454e-8fd0-c3f81339d20e',
      'TR',
      '5.1',
      '2020-01',
      '2020-02',
      'xlsx',
    );
  });
});
