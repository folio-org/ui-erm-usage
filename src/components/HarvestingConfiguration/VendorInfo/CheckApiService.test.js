import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers';
import {
  CS4,
  CS50,
} from '../../../util/constants';
import CheckApiService from './CheckApiService';
import useServiceStatus from './useServiceStatus';

jest.mock('./useServiceStatus');

describe('CheckApiService', () => {
  const serviceUrl = 'https://api.example.com/status';

  const renderCheckApiService = (serviceType) => {
    return renderWithIntl(
      <CheckApiService serviceUrl={serviceUrl} serviceType={serviceType} />
    );
  };

  it('should render loading component if isLoading=true', () => {
    useServiceStatus.mockReturnValue({
      error: null,
      fetchStatus: jest.fn(),
      isLoading: true,
      status: null,
    });

    renderCheckApiService(CS50);

    expect(screen.getByText(/.../i)).toBeInTheDocument();
  });

  it('should render active label if status=true', () => {
    useServiceStatus.mockReturnValue({
      error: null,
      fetchStatus: jest.fn(),
      isLoading: false,
      status: true,
    });

    renderCheckApiService(CS50);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render inactive label if status=false', () => {
    useServiceStatus.mockReturnValue({
      error: null,
      fetchStatus: jest.fn(),
      isLoading: false,
      status: false,
    });

    renderCheckApiService(CS50);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should render error message', () => {
    useServiceStatus.mockReturnValue({
      error: 'error',
      fetchStatus: jest.fn(),
      isLoading: false,
      status: null,
    });

    renderCheckApiService(CS50);

    expect(screen.getByText('Can not connect')).toBeInTheDocument();
  });

  it('should disable button for unsupported service types', () => {
    useServiceStatus.mockReturnValue({
      error: null,
      fetchStatus: jest.fn(),
      isLoading: false,
      status: null,
    });

    renderCheckApiService(CS4);

    expect(screen.getByRole('button', { name: 'Check status' })).toBeDisabled();
    expect(screen.getByText('Status check not supported for selected service type')).toBeInTheDocument();
  });

  it('should call fetchStatus when button is clicked', async () => {
    const fetchStatusMock = jest.fn();

    useServiceStatus.mockReturnValue({
      error: null,
      fetchStatus: fetchStatusMock,
      isLoading: false,
      status: null,
    });

    renderCheckApiService(CS50);

    const button = screen.getByRole('button', { name: 'Check status' });
    expect(button).toBeEnabled();

    await userEvent.click(button);
    expect(fetchStatusMock).toHaveBeenCalled();
  });
});
