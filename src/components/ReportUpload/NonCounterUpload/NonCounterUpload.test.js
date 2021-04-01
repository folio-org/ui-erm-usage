import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useStripes } from '@folio/stripes/core';
import renderWithIntl from '../../../../test/jest/helpers';
import NonCounterUpload from './NonCounterUpload';

const onClose = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const udpId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';

const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderNonCounterUpload = (stripes) => {
  return act(() => {
    renderWithIntl(
      <MemoryRouter>
        <NonCounterUpload
          onClose={onClose}
          onFail={onFail}
          onSuccess={onSuccess}
          open
          stripes={stripes}
          udpId={udpId}
        />
      </MemoryRouter>
    );
  });
};

describe('NonCounterUpload', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });
  describe('render non-counter upload', () => {
    beforeEach(() => {
      renderNonCounterUpload(stripes);
    });

    test('select file button is rendered', async () => {
      const selectFile = screen.getByRole('button', {
        name: 'Or select file for counter report upload',
      });
      expect(selectFile).toBeInTheDocument();
    });

    test('upload file', async () => {
      const yearInput = screen.getByLabelText('Year', {
        exact: false,
      });
      userEvent.type(yearInput, '2020');

      const noteInput = screen.getByLabelText('Note', {
        exact: false,
      });
      userEvent.type(noteInput, 'Test note');

      const inputEl = screen.getByTestId('fileInput');
      await act(async () => fireEvent.change(inputEl, { target: { files: [file] } }));
      await waitFor(() => screen.getByText('file.json'));

      const saveButton = screen.getByRole('button', {
        name: 'Save',
      });
      await waitFor(() => expect(saveButton).not.toHaveAttribute('disabled'));
      await act(async () => userEvent.click(saveButton));

      await waitFor(() => expect(onSuccess).toBeCalled());
    });

    test('upload link', async () => {
      const yearInput = screen.getByLabelText('Year', {
        exact: false,
      });
      userEvent.type(yearInput, '2020');

      const noteInput = screen.getByLabelText('Note', {
        exact: false,
      });
      userEvent.type(noteInput, 'Test note');

      const inputEl = screen.getByTestId('fileInput');
      await act(async () => fireEvent.change(inputEl, { target: { files: [file] } }));
      await waitFor(() => screen.getByText('file.json'));

      const linkButton = screen.getByRole('radio', {
        name: 'Link file',
      });
      await userEvent.click(linkButton);

      const linkInput = screen.getByLabelText('Link URL', {
        exact: false,
      });
      userEvent.type(linkInput, 'http://www.link.com');

      const saveButton = screen.getByRole('button', {
        name: 'Save',
      });
      await waitFor(() => expect(saveButton).not.toHaveAttribute('disabled'));
      await act(async () => userEvent.click(saveButton));

      await waitFor(() => expect(onSuccess).toBeCalled());
    });
  });
});
