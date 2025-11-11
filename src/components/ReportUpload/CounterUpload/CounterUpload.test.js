import { MemoryRouter } from 'react-router-dom';

import { fireEvent, screen, waitFor, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useStripes } from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers';
import { server, rest } from '../../../../test/jest/testServer';
import CounterUpload from './CounterUpload';

const onClose = jest.fn();
const onSuccess = jest.fn();
const udpId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';

const file = new File(['foo'], 'file.json', { type: 'text/plain' });

const renderCounterUpload = (stripes) => {
  return renderWithIntl(
    <MemoryRouter>
      <CounterUpload
        onClose={onClose}
        onSuccess={onSuccess}
        open
        stripes={stripes}
        udpId={udpId}
      />
    </MemoryRouter>
  );
};

const uploadFile = async ({ mockFile, expectedError, expectedMessage, mockHandler }) => {
  if (mockHandler) server.use(mockHandler);

  const saveButton = screen.getByRole('button', { name: 'Save' });
  expect(saveButton).toBeDisabled();

  const inputEl = screen.getByTestId('fileInput');
  fireEvent.change(inputEl, { target: { files: [mockFile] } });
  await screen.findByText(mockFile.name);

  await waitFor(() => expect(saveButton).toBeEnabled());
  await userEvent.click(saveButton);

  if (expectedError) {
    await waitFor(() => {
      expect(screen.getByText(expectedError)).toBeInTheDocument();
    });
    if (expectedMessage) {
      const details = screen.getByText(/more information/i).closest('details');
      expect(within(details).getByText(expectedMessage)).toBeInTheDocument();
    }
  } else {
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  }
};

describe('CounterUpload', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    onClose.mockClear();
    onSuccess.mockClear();
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
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({
            code: 'REPORTS_ALREADY_PRESENT',
            message: 'One or more reports already exist for the time period.',
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
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) => {
          return res(ctx.text('success'));
        }
      )
    );
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(yesButton);
    expect(onSuccess).toHaveBeenCalled();
  });

  const uploadErrorScenarios = [
    {
      name: 'unsupported file format (error code translation exists)',
      mockFile: file,
      expectedError: 'The file format is not supported.',
      expectedMessage: 'java.lang.IllegalArgumentException: Invalid filename',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({
              code: 'UNSUPPORTED_FILE_FORMAT',
              message: 'The file format is not supported.',
              details: 'java.lang.IllegalArgumentException: Invalid filename',
            })
          )
      ),
    },
    {
      name: 'file exceeds maximum size (error code translation exists)',
      mockFile: file,
      expectedError: 'The file size exceeds the maximum allowed size.',
      expectedMessage: 'The maximum file size is 209715200 bytes.',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({
              code: 'MAXIMUM_FILESIZE_EXCEEDED',
              message: 'The file size exceeds the maximum allowed size.',
              details: 'The maximum file size is 209715200 bytes.',
            })
          )
      ),
    },
    {
      name: 'error without code property (err.message exists)',
      mockFile: file,
      expectedError: 'An error has occurred.',
      expectedMessage: 'foo',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({
              message: 'foo',
            })
          )
      ),
    },
    {
      name: 'error without code and message properties (err is undefined)',
      mockFile: file,
      expectedError: 'An error has occurred.',
      expectedMessage: '',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({})
          )
      ),
    },
    {
      name: 'error 404 without response body',
      mockFile: file,
      expectedError: 'An error has occurred.',
      expectedMessage: '',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(ctx.status(404))
      ),
    },
    {
      name: 'error with code but without translation',
      mockFile: file,
      expectedError: 'ui-erm-usage.counter.upload.error.NEW_ERROR_CODE',
      expectedMessage: '',
      mockHandler: rest.post(
        'https://folio-testing-okapi.dev.folio.org/counter-reports/multipartupload/provider/:udpId',
        (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({
              code: 'NEW_ERROR_CODE',
              message: 'This is a new error code without translation',
            })
          )
      ),
    },
  ];

  test.each(uploadErrorScenarios)('upload scenario: $name', async ({ mockFile, expectedError, expectedMessage, mockHandler }) => {
    await uploadFile({ mockFile, expectedError, expectedMessage, mockHandler });
  });
});
