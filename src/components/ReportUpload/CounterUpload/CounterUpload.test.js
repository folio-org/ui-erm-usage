import React from 'react';
import { fireEvent, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
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
        open
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
    renderCounterUpload(stripes);
  });

  test('select file button is rendered', () => {
    const selectFile = screen.getByRole('button', {
      name: 'Or select file for counter report upload',
    });
    expect(selectFile).toBeInTheDocument();
  });

  test('drop file', async () => {
    const inputEl = screen.getByTestId('fileInput');
    fireEvent.change(inputEl, { target: { files: [file] } });
    await screen.findByText('file.json');
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

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    const inputEl = screen.getByTestId('fileInput');
    fireEvent.change(inputEl, { target: { files: [file] } });
    await screen.findByText('file.json');
    await waitFor(() => expect(saveButton).toBeEnabled());

    await userEvent.click(saveButton);
    await screen.findByText('Report exists. Do you want to overwrite?');

    server.use(
      rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/upload/provider/:udpId?overwrite=:overwrite',
        (req, res, ctx) => {
          return res(ctx.text('success'));
        }
      )
    );
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(yesButton);
    expect(onSuccess).toBeCalled();
  });
});
