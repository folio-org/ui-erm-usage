import React from 'react';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../../test/jest/helpers';
import { server, rest } from '../../../../test/jest/testServer';
import CounterUpload from './CounterUpload';

const onClose = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const udpId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';

const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderCounterUpload = (stripes) => {
  return renderWithIntl(
    <MemoryRouter>
      <CounterUpload
        onClose={onClose}
        onFail={onFail}
        onSuccess={onSuccess}
        open={true}
        stripes={stripes}
        udpId={udpId}
      />
    </MemoryRouter>
  );
};

describe('CounterUpload', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  describe('render counter upload', () => {
    beforeEach(() => {
      renderCounterUpload(stripes);
    });

    test('select file button is rendered', async () => {
      const selectFile = screen.getByRole('button', {
        name: 'Or select file for counter report upload',
      });
      expect(selectFile).toBeInTheDocument();
    });

    test('drop file', async () => {
      const inputEl = screen.getByTestId('fileInput');
      await fireEvent.change(inputEl, { target: { files: [file] } });
      expect(screen.getByText('file.json')).toBeInTheDocument();
    });

    test('upload file', async () => {
      const inputEl = screen.getByTestId('fileInput');
      await fireEvent.change(inputEl, { target: { files: [file] } });
      await waitFor(() =>
        expect(screen.getByText('file.json')).toBeInTheDocument()
      );

      const saveButton = screen.getByRole('button', {
        name: 'Save',
      });
      await waitFor(() => expect(saveButton).not.toHaveAttribute('disabled'));
      userEvent.click(saveButton);
      
      await waitFor(() =>
        expect(
          screen.getByText('Uploading report. Please wait!')
        ).toBeInTheDocument()
      );
      waitForElementToBeRemoved(
        screen.getByText('Uploading report. Please wait!')
      );
      
      await waitFor(() => expect(onSuccess).toBeCalled());
    });
  });
});
