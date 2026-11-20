import { FORM_ERROR } from 'final-form';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { CalloutContext } from '@folio/stripes/core';

import harvesterImpls from '../../test/fixtures/harvesterImpls';
import renderWithIntl from '../../test/jest/helpers';
import UDPForm from '../components/views/UDPForm';
import UDPCreateRoute from './UDPCreateRoute';

jest.mock('@folio/stripes-leipzig-components', () => ({
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
}));

jest.mock('../components/views/UDPForm', () => jest.fn(() => null));

const history = { push: jest.fn() };
const location = { search: '?sort=label' };
const mutateAsync = jest.fn();

let createOptions;

const sendCallout = jest.fn();

const renderUDPCreateRoute = () => renderWithIntl(
  <CalloutContext.Provider value={{ sendCallout }}>
    <UDPCreateRoute
      history={history}
      location={location}
    />
  </CalloutContext.Provider>
);

describe('UDPCreateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createOptions = undefined;

    useOkapiKyQuery.mockReturnValue({
      data: harvesterImpls[0],
      isLoading: false,
    });

    useOkapiKyMutation.mockReturnValue({
      useCreate: (options) => {
        createOptions = options;

        return { mutateAsync };
      },
    });
  });

  it('sets initial values from the default harvester implementation', () => {
    renderUDPCreateRoute();

    expect(UDPForm).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { harvesterImpls },
        initialValues: {
          status: 'active',
          harvestingConfig: {
            harvestingStatus: 'active',
            reportRelease: '5.1',
            sushiConfig: {
              serviceType: 'cs51',
            },
          },
        },
      }),
      expect.anything()
    );
  });

  it('navigates to the UDP list when the form is closed', () => {
    renderUDPCreateRoute();

    const { handlers } = UDPForm.mock.calls[0][0];

    handlers.onClose();

    expect(history.push).toHaveBeenCalledWith('/eusage?sort=label');
  });

  it('navigates to the created UDP after successful creation', async () => {
    renderUDPCreateRoute();

    const values = { label: 'Provider' };
    const createdUdp = { id: 'created-udp-id' };
    const { onSubmit } = UDPForm.mock.calls[0][0];

    await onSubmit(values);

    expect(mutateAsync).toHaveBeenCalledWith(values);

    createOptions.onSuccess(createdUdp);

    expect(history.push).toHaveBeenCalledWith(
      '/eusage/view/created-udp-id?sort=label'
    );
  });

  it('shows an error when creating a UDP fails', async () => {
    const error = new Error('Create failed');

    mutateAsync.mockRejectedValueOnce(error);

    renderUDPCreateRoute();

    const values = { label: 'Provider' };
    const { onSubmit } = UDPForm.mock.calls[0][0];

    const result = await onSubmit(values);

    expect(result).toEqual({
      [FORM_ERROR]: error.message,
    });

    expect(sendCallout).toHaveBeenCalledTimes(1);
    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
      type: 'error',
      message: expect.stringContaining(error.message),
      timeout: 0,
    }));

    expect(history.push).not.toHaveBeenCalled();
  });

  it('shows an error when loading harvester implementations fails', async () => {
    const error = new Error('Loading harvester implementations failed');

    useOkapiKyQuery.mockReset().mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
    });

    renderUDPCreateRoute();

    await waitFor(() => {
      expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
        type: 'error',
        message: expect.stringContaining(error.message),
      }));
    });

    expect(UDPForm).not.toHaveBeenCalled();
  });
});
