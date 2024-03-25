import { fireEvent, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import FileUploader from './FileUploader';

const onChangeMock = jest.fn();
const file = new File(['dummy content'], 'dummy.txt', { type: 'text/plain' });

const renderFileUploader = () => {
  return renderWithIntl(<FileUploader onChange={onChangeMock} />);
};

describe('FileUploader', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    renderFileUploader();
  });

  it('renders elements', () => {
    expect(screen.getByText('Drop file here')).toBeInTheDocument();
    expect(screen.getByText('or select file')).toBeInTheDocument();
  });

  it('calls onChange when a file is dropped', async () => {
    const dropzone = screen.getByTestId('fileInput');
    fireEvent.drop(dropzone, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(file);
    });
  });

  it('calls onChange when a file is selected', async () => {
    const dropzone = screen.getByTestId('fileInput');
    fireEvent.change(dropzone, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(file);
    });
  });
});
