import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import ReportInfo from './ReportInfo';

const render = (stripes, failedReason) => {
  const msg = failedReason ? `{ "failedReason": "${failedReason}"}` : '{}';
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <ReportInfo report={JSON.parse(msg)} udpLabel="Test Provider" />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('ReportInfo.js', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('has permission', () => {
    stripes.hasPerm = () => true;
    render(stripes);
    expect(screen.getByText('Delete report')).toBeInTheDocument();
  });

  test('has no permission', () => {
    stripes.hasPerm = () => false;
    render(stripes);
    expect(screen.queryByText('Delete report')).not.toBeInTheDocument();
  });

  test('no failedReason', () => {
    render(stripes);
    expect(screen.queryByText('Info')).not.toBeInTheDocument();
  });

  test('failedReason without Number or Code', () => {
    render(stripes, 'failure message');
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('failure message')).toBeInTheDocument();
  });

  test('failedReason with defined Number', () => {
    render(stripes, 'Exception{Number=1010, Severity=ERROR, Message=A message}');
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code with whitespace', () => {
    render(
      stripes,
      '{\\"Code\\": 1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}'
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code without whitespace', () => {
    render(
      stripes,
      '{\\"Code\\":1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}'
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with warnings (1-999)', () => {
    render(
      stripes,
      '{\\"Code\\": 123, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}'
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Warnings (123)')).toBeInTheDocument();
  });

  test('failedReason with multiple defined Numbers', () => {
    render(stripes, 'Exception{Number=1010, Number=2020}');
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with HTML-tag', () => {
    render(stripes, '<html lang=`en`>');
    expect(screen.getByText('An error has occured')).toBeInTheDocument();
  });

  describe('raw report download', () => {
    test.each([
      ['4', 'xml'],
      ['5', 'json'],
      ['5.1', 'json'],
      ['6', 'json'],
      [undefined, 'json'],
    ])('release %s is downloaded as %s', async (release, fileType) => {
      const downloadRawReport = jest.fn();
      renderWithIntl(
        <StripesContext.Provider value={stripes}>
          <MemoryRouter>
            <ReportInfo
              downloadRawReport={downloadRawReport}
              report={{ release }}
              udpLabel="Test Provider"
            />
          </MemoryRouter>
        </StripesContext.Provider>
      );

      expect(screen.queryByText(/unknown/i)).not.toBeInTheDocument();
      await userEvent.click(screen.getByText(`Download report as ${fileType.toUpperCase()}`));
      expect(downloadRawReport).toHaveBeenCalledWith(fileType);
    });
  });
});
