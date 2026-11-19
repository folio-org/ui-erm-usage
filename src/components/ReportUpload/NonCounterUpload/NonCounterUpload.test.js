import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  CalloutContext,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers';
import {
  API_CUSTOM_REPORTS,
  API_FILES,
} from '../../../util/constants';
import NonCounterUpload from './NonCounterUpload';

const onClose = jest.fn();
const onFail = jest.fn();
const onSuccess = jest.fn();
const sendCallout = jest.fn();
const udpId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';

const file = new File(['foo'], 'file.json', { type: 'text/plain' });
const fileId = '9d1e4bb0-4a8b-4b0e-a1c5-2f8a0f6b1c11';

const NonCounterUploadTest = () => {
  const stripes = useStripes();

  return (
    <CalloutContext.Provider value={{ sendCallout }}>
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
    </CalloutContext.Provider>
  );
};

const renderNonCounterUpload = () => renderWithIntl(
  <NonCounterUploadTest />
);

describe('NonCounterUpload', () => {
  let ky;

  beforeEach(() => {
    jest.clearAllMocks();

    ky = {
      post: jest.fn(),
      delete: jest.fn(),
    };

    useOkapiKy.mockReturnValue(ky);

    ky.post.mockImplementation((url) => Promise.resolve(
      new Response(
        JSON.stringify(url === API_FILES ? { id: fileId } : {}),
        { status: 201 }
      )
    ));

    ky.delete.mockResolvedValue(new Response(null, { status: 204 }));
  });

  describe('render non-counter upload', () => {
    beforeEach(() => {
      renderNonCounterUpload();
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
      expect(ky.post).toHaveBeenCalledWith(
        API_FILES,
        {
          body: file,
          headers: { 'Content-Type': 'application/octet-stream' },
          timeout: false,
        }
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());

      await userEvent.click(saveButton);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(ky.post).toHaveBeenCalledWith(
        API_CUSTOM_REPORTS,
        expect.objectContaining({
          json: expect.objectContaining({
            fileId,
            fileName: 'file.json',
            providerId: udpId,
          }),
        })
      );
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
      expect(ky.delete).toHaveBeenCalledWith(
        `${API_FILES}/${fileId}`,
        expect.anything()
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());

      await userEvent.click(saveButton);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(ky.post).toHaveBeenCalledWith(
        API_CUSTOM_REPORTS,
        expect.objectContaining({
          json: expect.objectContaining({
            linkUrl: 'http://www.link.com',
            providerId: udpId,
          }),
        })
      );
    });
  });

  describe('saving fails', () => {
    const saveLink = async () => {
      renderNonCounterUpload();

      await userEvent.type(
        screen.getByLabelText('Year', { exact: false }),
        '2020'
      );
      await userEvent.click(screen.getByRole('radio', { name: 'Link file' }));
      await userEvent.type(
        screen.getByLabelText('Link URL', { exact: false }),
        'http://www.link.com'
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(saveButton).toBeEnabled());

      await userEvent.click(saveButton);
    };

    test('shows the response text of the backend for HTTP errors', async () => {
      ky.post.mockRejectedValue(Object.assign(new Error('Unprocessable Entity'), {
        response: {
          text: () => Promise.resolve('Year is invalid'),
        },
      }));

      await saveLink();

      await waitFor(() => expect(onFail).toHaveBeenCalledWith('Year is invalid'));
      expect(onSuccess).not.toHaveBeenCalled();
    });

    test('shows the error message for other errors', async () => {
      ky.post.mockRejectedValue(new TypeError('Failed to fetch'));

      await saveLink();

      await waitFor(() => expect(onFail).toHaveBeenCalledWith('Failed to fetch'));
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
