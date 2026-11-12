import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKyMutation } from '@folio/stripes-leipzig-components';
import { useStripes } from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers';
import {
  API_CUSTOM_REPORTS,
  API_FILES,
  KEY_CUSTOM_REPORTS,
  KEY_FILES,
} from '../../../util/constants';
import NonCounterUpload from './NonCounterUpload';

jest.mock('@folio/stripes-leipzig-components', () => ({
  ...jest.requireActual('@folio/stripes-leipzig-components'),
  useOkapiKyMutation: jest.fn(),
}));

const onClose = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const udpId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';

const file = new File(['foo'], 'file.json', { type: 'text/plain' });
const fileId = '9d1e4bb0-4a8b-4b0e-a1c5-2f8a0f6b1c11';

const renderNonCounterUpload = (stripes) => {
  return renderWithIntl(
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
};

describe('NonCounterUpload', () => {
  let stripes;
  let createCustomReport;
  let uploadFile;
  let deleteFile;
  let uploadOptions;

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
    createCustomReport = jest.fn().mockResolvedValue({});
    uploadFile = jest.fn().mockResolvedValue({ id: fileId });
    deleteFile = jest.fn().mockResolvedValue(null);

    // NonCounterUpload creates the custom report, NonCounterInnerForm uploads and deletes the file
    useOkapiKyMutation.mockImplementation(({ api }) => ({
      useCreate: (options) => {
        if (api === API_FILES) {
          uploadOptions = options;
          return { mutateAsync: uploadFile };
        }

        return { mutateAsync: createCustomReport };
      },
      useDelete: () => ({ mutateAsync: deleteFile }),
    }));
  });
  describe('render non-counter upload', () => {
    beforeEach(() => {
      renderNonCounterUpload(stripes);
    });

    test('select file button is rendered', () => {
      const selectFile = screen.getByRole('button', {
        name: 'or select file',
      });
      expect(selectFile).toBeInTheDocument();
    });

    test('upload file', async () => {
      const yearInput = screen.getByLabelText('Year', { exact: false });
      await userEvent.type(yearInput, '2020');

      const noteInput = screen.getByLabelText('Note', { exact: false });
      await userEvent.type(noteInput, 'Test note');

      const inputEl = screen.getByTestId('fileInput');

      await userEvent.upload(inputEl, file);
      await screen.findByText('file.json');

      // the file is sent as binary body without the default timeout
      expect(uploadFile).toHaveBeenCalledWith(file);
      expect(uploadOptions.kyOptions(file)).toEqual({
        body: file,
        headers: { 'Content-Type': 'application/octet-stream' },
        timeout: false,
      });

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());
      await userEvent.click(saveButton);
      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(useOkapiKyMutation).toHaveBeenCalledWith({ mutationKey: KEY_CUSTOM_REPORTS, api: API_CUSTOM_REPORTS });
      expect(createCustomReport).toHaveBeenCalledWith(expect.objectContaining({
        fileId,
        fileName: 'file.json',
        providerId: udpId,
      }));
    });

    test('upload link', async () => {
      const yearInput = screen.getByLabelText('Year', { exact: false });
      await userEvent.type(yearInput, '2020');

      const noteInput = screen.getByLabelText('Note', { exact: false });
      await userEvent.type(noteInput, 'Test note');

      const inputEl = screen.getByTestId('fileInput');
      await userEvent.upload(inputEl, file);
      await screen.findByText('file.json');

      const linkButton = screen.getByRole('radio', { name: 'Link file' });
      await userEvent.click(linkButton);

      const linkInput = screen.getByLabelText('Link URL', { exact: false });
      await userEvent.type(linkInput, 'http://www.link.com');

      // the uploaded file is deleted, because a link is used instead
      expect(useOkapiKyMutation).toHaveBeenCalledWith({ mutationKey: KEY_FILES, api: API_FILES, id: fileId });
      expect(deleteFile).toHaveBeenCalled();

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());
      await userEvent.click(saveButton);
      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(createCustomReport).toHaveBeenCalledWith(expect.objectContaining({
        linkUrl: 'http://www.link.com',
        providerId: udpId,
      }));
    });
  });

  describe('saving fails', () => {
    const saveLink = async () => {
      renderNonCounterUpload(stripes);
      await userEvent.type(screen.getByLabelText('Year', { exact: false }), '2020');
      await userEvent.click(screen.getByRole('radio', { name: 'Link file' }));
      await userEvent.type(screen.getByLabelText('Link URL', { exact: false }), 'http://www.link.com');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());
      await userEvent.click(saveButton);
    };

    test('shows the response text of the backend for HTTP errors', async () => {
      createCustomReport.mockRejectedValue(Object.assign(new Error('Unprocessable Entity'), {
        response: { text: () => Promise.resolve('Year is invalid') },
      }));
      await saveLink();

      await waitFor(() => expect(onFail).toHaveBeenCalledWith('Year is invalid'));
      expect(onSuccess).not.toHaveBeenCalled();
    });

    test('shows the error message for other errors', async () => {
      createCustomReport.mockRejectedValue(new TypeError('Failed to fetch'));
      await saveLink();

      await waitFor(() => expect(onFail).toHaveBeenCalledWith('Failed to fetch'));
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
