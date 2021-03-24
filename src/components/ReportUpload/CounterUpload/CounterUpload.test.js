import React from 'react';
import {
  act,
  fireEvent,
  screen,
  waitFor,
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
  return act(() => {
    renderWithIntl(
      <MemoryRouter>
        <CounterUpload
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

    test('upload counter report', async () => {
      server.use(
        rest.post(
          'https://folio-testing-okapi.dev.folio.org/counter-reports/upload/provider/:udpId?overwrite=:overwrite',
          (req, res, ctx) => {
            return res(ctx.status(500), ctx.body('Report already existing'));
          }
        )
      );
      const inputEl = screen.getByTestId('fileInput');
      await fireEvent.change(inputEl, { target: { files: [file] } });
      await waitFor(() => screen.getByText('file.json'));

      const saveButton = screen.getByRole('button', {
        name: 'Save',
      });
      await waitFor(() => expect(saveButton).not.toHaveAttribute('disabled'));
      await act(async () => userEvent.click(saveButton));

      await waitFor(() => screen.getByText('Report exists. Do you want to overwrite?'));

      server.use(
        rest.post(
          'https://folio-testing-okapi.dev.folio.org/counter-reports/upload/provider/:udpId?overwrite=:overwrite',
          (req, res, ctx) => {
            return res(ctx.text('success'));
          }
        )
      );
      const yesButton = screen.getByRole('button', {
        name: 'Yes',
      });
      await act(async () => userEvent.click(yesButton));
      await waitFor(() => expect(onSuccess).toBeCalled());
    });
  });
});
