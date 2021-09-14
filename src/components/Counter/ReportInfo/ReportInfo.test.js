import React from 'react';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import ReportInfo from './ReportInfo';

const render = (failedReason) => {
  const msg = failedReason ? `{ "failedReason": "${failedReason}"}` : '{}';
  return renderWithIntl(
    <ReportInfo
      report={JSON.parse(msg)}
      udpLabel="Test Provider"
    />
  );
};

describe('ReportInfo.js', () => {
  test('no failedReason', () => {
    render();
    expect(screen.queryByText('Info')).not.toBeInTheDocument();
  });

  test('failedReason without Number or Code', () => {
    render('failure message');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('failure message')).toBeInTheDocument();
  });

  test('failedReason with defined Number', () => {
    render('Exception{Number=1010, Severity=ERROR, Message=A message}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code with whitespace', () => {
    render('{\\"Code\\": 1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code without whitespace', () => {
    render('{\\"Code\\":1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with warnings (1-999)', () => {
    render('{\\"Code\\": 123, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Warnings (123)')).toBeInTheDocument();
  });

  test('failedReason with multiple defined Numbers', () => {
    render('Exception{Number=1010, Number=2020}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });
});
