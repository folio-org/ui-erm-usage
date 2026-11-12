import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import ReportInfo from './ReportInfo';

const renderReport = (stripes, report = {}, props = {}) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <ReportInfo report={report} udpLabel="Test Provider" {...props} />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('ReportInfo.js', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('has permission', () => {
    stripes.hasPerm = () => true;
    renderReport(stripes);
    expect(screen.getByText('Delete report')).toBeInTheDocument();
  });

  test('has no permission', () => {
    stripes.hasPerm = () => false;
    renderReport(stripes);
    expect(screen.queryByText('Delete report')).not.toBeInTheDocument();
  });

  test('no failedReason', () => {
    renderReport(stripes);
    expect(screen.queryByText('Info')).not.toBeInTheDocument();
  });

  test('failedReason without Number or Code', () => {
    renderReport(stripes, { failedReason: 'failure message' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('failure message')).toBeInTheDocument();
  });

  test('failedReason with defined Number', () => {
    renderReport(stripes, { failedReason: 'Exception{Number=1010, Severity=ERROR, Message=A message}' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code with whitespace', () => {
    renderReport(stripes, { failedReason: '{"Code": 1010, "Severity": "Error", "Message": "A message"}' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code without whitespace', () => {
    renderReport(stripes, { failedReason: '{"Code":1010, "Severity": "Error", "Message": "A message"}' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with warnings (1-999)', () => {
    renderReport(stripes, { failedReason: '{"Code": 123, "Severity": "Error", "Message": "A message"}' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Warnings (123)')).toBeInTheDocument();
  });

  test('failedReason with multiple defined Numbers', () => {
    renderReport(stripes, { failedReason: 'Exception{Number=1010, Number=2020}' });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with HTML-tag', () => {
    renderReport(stripes, { failedReason: '<html lang=`en`>' });
    expect(screen.getByText('An error has occured')).toBeInTheDocument();
  });

  describe('apiExceptions', () => {
    const exception = (code) => ({ code, message: `Message ${code}` });

    test('shows the code of a single apiException', () => {
      renderReport(stripes, { failedReason: 'Report not valid', apiExceptions: [exception(1010)] });
      expect(screen.getByText('Info')).toBeInTheDocument();
      expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
      expect(screen.queryByText('Report not valid')).not.toBeInTheDocument();
    });

    test('shows a label for every code', () => {
      renderReport(stripes, { apiExceptions: [exception(1010), exception(123)] });
      expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
      expect(screen.getByText('Exception: Warnings (123)')).toBeInTheDocument();
    });

    test('prefers apiExceptions over failedReason', () => {
      renderReport(stripes, {
        failedReason: 'Exception{Number=123, Severity=WARNING}',
        apiExceptions: [exception(1010)],
      });
      expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
      expect(screen.queryByText('Exception: Warnings (123)')).not.toBeInTheDocument();
    });

    test('shows failedReason when apiExceptions is empty', () => {
      renderReport(stripes, { failedReason: 'failure message', apiExceptions: [] });
      expect(screen.getByText('failure message')).toBeInTheDocument();
    });

    test('treats a report with only apiExceptions as failed', () => {
      stripes.hasPerm = () => true;
      renderReport(stripes, { release: '5', reportName: 'TR', apiExceptions: [exception(1010)] });
      expect(screen.getByText('Delete entry')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /JSON/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /CSV/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /XLSX/ })).not.toBeInTheDocument();
    });

    test('treats a report with empty apiExceptions and no failedReason as successful', () => {
      stripes.hasPerm = () => true;
      renderReport(stripes, { release: '5', reportName: 'TR', apiExceptions: [] });
      expect(screen.getByText('Delete report')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /JSON/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /CSV/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /XLSX/ })).toBeInTheDocument();
    });
  });

  describe('raw report download', () => {
    test.each([
      ['4', 'xml', 'json'],
      ['5', 'json', 'xml'],
      ['5.1', 'json', 'xml'],
      ['6', 'json', 'xml'],
      [undefined, 'json', 'xml'],
    ])('release %s is downloaded as %s, not as %s', async (release, expectedFileType, absentFileType) => {
      const downloadRawReport = jest.fn();
      renderReport(stripes, { release }, { downloadRawReport });

      expect(screen.queryByText(`Download report as ${absentFileType.toUpperCase()}`)).not.toBeInTheDocument();
      await userEvent.click(screen.getByText(`Download report as ${expectedFileType.toUpperCase()}`));
      expect(downloadRawReport).toHaveBeenCalledWith(expectedFileType);
    });
  });
});
