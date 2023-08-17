import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import JobsViewResultCell from './JobsViewResultCell';

const renderComponent = (errorMessage, text) => {
  return render(<JobsViewResultCell errorMessage={errorMessage} text={text} />);
};

describe('JobsViewResultCell', () => {
  test('no error message, no InfoPopover', () => {
    renderComponent('', 'Success');
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('error message, InfoPopover with error message', async () => {
    renderComponent('Error message', 'Failure');
    expect(screen.getByText('Failure')).toBeInTheDocument();
    const infoBtn = screen.queryByRole('button');
    expect(infoBtn).toBeInTheDocument();
    await userEvent.click(infoBtn);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
