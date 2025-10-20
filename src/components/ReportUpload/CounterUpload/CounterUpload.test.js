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
const unsupportedFile = new File(['foo'], 'unsupportedFile.txt', { type: 'text/plain' });
const largeFile = new File([new ArrayBuffer(210 * 1024 * 1024)], 'largeFile.json', { type: 'text/plain' });

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
    const selectFile = screen.getByRole('button', { name: 'or select file' });
    expect(selectFile).toBeInTheDocument();
  });

  test('drop file', async () => {
    const inputEl = screen.getByTestId('fileInput');
    fireEvent.change(inputEl, { target: { files: [file] } });
    await screen.findByText('file.json');
  });

  test('upload and overwrite counter report', async () => {
    server.use(
      rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId?overwrite=:overwrite',
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({
            code: 'REPORTS_ALREADY_PRESENT',
            message: 'Report exists. Do you want to overwrite?',
          }));
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
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId?overwrite=:overwrite',
        (req, res, ctx) => {
          return res(ctx.text('success'));
        }
      )
    );
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(yesButton);
    expect(onSuccess).toHaveBeenCalled();
  });

  test('upload unsupported counter report', async () => {
    server.use(
      rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId??overwrite=false',
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({
            code: 'UNSUPPORTED_FILE_FORMAT',
            message: 'The file format is not supported.',
          }));
        }
      )
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    const inputEl = screen.getByTestId('fileInput');
    fireEvent.change(inputEl, { target: { files: [unsupportedFile] } });
    screen.findByText('unsupportedFile.txt');
    await waitFor(() => expect(saveButton).toBeEnabled());

    userEvent.click(saveButton);

    await waitFor(() => expect(onFail).toHaveBeenCalledWith('The file format is not supported.'));
  });

  test('upload counter report larger 200MB', async () => {
    server.use(
      rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId??overwrite=false',
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({
            code: 'MAXIMUM_FILESIZE_EXCEEDED',
            message: 'The file size exceeds the maximum allowed size.',
          }));
        }
      )
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    const inputEl = screen.getByTestId('fileInput');
    fireEvent.change(inputEl, { target: { files: [largeFile] } });
    screen.findByText('largeFile.json');
    await waitFor(() => expect(saveButton).toBeEnabled());

    userEvent.click(saveButton);

    await waitFor(() => expect(onFail).toHaveBeenCalledWith('The file size exceeds the maximum allowed size.'));
  });
});
