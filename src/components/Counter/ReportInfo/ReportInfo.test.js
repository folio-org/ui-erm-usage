import React from 'react';
import { screen } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import ReportInfo from './ReportInfo';

const render = (stripes, failedReason) => {
  const msg = failedReason ? `{ "failedReason": "${failedReason}"}` : '{}';
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <ReportInfo
          report={JSON.parse(msg)}
          udpLabel="Test Provider"
        />
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
    expect(screen.queryByText('Delete report')).toBeInTheDocument();
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
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('failure message')).toBeInTheDocument();
  });

  test('failedReason with defined Number', () => {
    render(stripes, 'Exception{Number=1010, Severity=ERROR, Message=A message}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code with whitespace', () => {
    render(stripes, '{\\"Code\\": 1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with defined Code without whitespace', () => {
    render(stripes, '{\\"Code\\":1010, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });

  test('failedReason with warnings (1-999)', () => {
    render(stripes, '{\\"Code\\": 123, \\"Severity\\": \\"Error\\", \\"Message\\": \\"A message\\"}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Warnings (123)')).toBeInTheDocument();
  });

  test('failedReason with multiple defined Numbers', () => {
    render(stripes, 'Exception{Number=1010, Number=2020}');
    expect(screen.queryByText('Info')).toBeInTheDocument();
    expect(screen.queryByText('SUSHI exception: Service busy (1010)')).toBeInTheDocument();
  });
});
