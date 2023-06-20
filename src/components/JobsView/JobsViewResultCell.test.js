import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobsViewResultCell from './JobsViewResultCell';

const renderComponent = (errorMessage, text) => {
  return render(<JobsViewResultCell errorMessage={errorMessage} text={text} />);
};

describe('JobsViewResultCell', () => {
  test('no error message, no InfoPopover', () => {
    const { queryByText, queryByRole } = renderComponent('', 'Success');
    expect(queryByText('Success')).toBeInTheDocument();
    expect(queryByRole('button')).toBeNull();
  });

  test('error message, InfoPopover with error message', () => {
    const { queryByText, queryByRole } = renderComponent('Error message', 'Failure');
    expect(queryByText('Failure')).toBeInTheDocument();
    const infoBtn = queryByRole('button');
    expect(infoBtn).toBeInTheDocument();
    userEvent.click(infoBtn);
    expect(queryByText('Error message')).toBeInTheDocument();
  });
});
