import { useQueryClient } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  CalloutContext,
  StripesContext,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import harvesterImpls from '../../test/fixtures/harvesterImpls';
import udp from '../../test/fixtures/udp';
import renderWithIntl from '../../test/jest/helpers';
import {
  API_HARVESTER_IMPL,
  API_UDPS,
  KEY_UDPS,
} from '../util/constants';
import UDPEditRoute from './UDPEditRoute';

const history = { push: jest.fn() };
const location = { search: '?sort=label' };
const sendCallout = jest.fn();

const udpData = {
  ...udp,
  status: 'active',
};

let queryClient;

const QueryClientCapture = () => {
  queryClient = useQueryClient();

  return null;
};

jest.mock('@folio/stripes-leipzig-components', () => ({
  ...jest.requireActual('@folio/stripes-leipzig-components'),
  Monthpicker: () => null,
}));

const renderUDPEditRoute = (stripes) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <CalloutContext.Provider value={{ sendCallout }}>
      <QueryClientCapture />
      <MemoryRouter>
        <UDPEditRoute
          history={history}
          location={location}
          match={{ params: { id: udp.id } }}
          stripes={stripes}
        />
      </MemoryRouter>
    </CalloutContext.Provider>
  </StripesContext.Provider>
);

describe('UDPEditRoute', () => {
  let stripes;
  let ky;
  let udpRecord;

  const mockGet = () => {
    ky.get.mockImplementation((url) => {
      let response;

      switch (url) {
        case API_HARVESTER_IMPL:
          response = harvesterImpls[0];
          break;
        case `${API_UDPS}/${udp.id}`:
          response = udpRecord;
          break;
        default:
          throw new Error(`Unexpected GET URL: ${url}`);
      }

      return {
        json: jest.fn().mockResolvedValue(response),
      };
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    stripes = useStripes();
    udpRecord = udpData;
    queryClient = undefined;

    ky = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    useOkapiKy.mockReturnValue(ky);

    mockGet();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('saves the UDP, invalidates its query and navigates to its view', async () => {
    renderUDPEditRoute(stripes);

    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    await userEvent.type(
      await screen.findByRole('textbox', { name: /provider name/i }), ' edited'
    );

    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    expect(ky.put).toHaveBeenCalledWith(`${API_UDPS}/${udp.id}`, expect.objectContaining({ json: expect.any(Object) }));

    expect(invalidateQueries).toHaveBeenCalledWith([
      KEY_UDPS,
      udp.id,
    ]);

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
  });

  test('navigates to the UDP view when the form is closed', async () => {
    renderUDPEditRoute(stripes);

    await userEvent.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
    expect(ky.put).not.toHaveBeenCalled();
  });

  test('shows an error and keeps the form open when updating the UDP fails', async () => {
    const error = new Error('Update failed');

    ky.put.mockRejectedValueOnce(error);

    renderUDPEditRoute(stripes);

    await userEvent.type(
      await screen.findByRole('textbox', { name: /provider name/i }), ' edited'
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Save & close/ })
    );

    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
      type: 'error',
      message: expect.stringContaining(error.message),
      timeout: 0,
    }));

    expect(document.querySelector('#form-udp')).toBeInTheDocument();
    expect(history.push).not.toHaveBeenCalled();
  });

  test('shows updated UDP data when edit is reopened after saving', async () => {
    const updatedUdp = {
      ...udpData,
      label: 'Updated provider name',
    };

    const { unmount } = renderUDPEditRoute(stripes);

    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    const providerName = await screen.findByRole(
      'textbox',
      { name: /provider name/i }
    );

    await userEvent.clear(providerName);
    await userEvent.type(providerName, updatedUdp.label);

    // The subsequent GET request should return the updated record.
    udpRecord = updatedUdp;

    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    expect(ky.put).toHaveBeenCalled();

    expect(invalidateQueries).toHaveBeenCalledWith([
      KEY_UDPS,
      udp.id,
    ]);

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);

    unmount();

    renderUDPEditRoute(stripes);

    expect(
      await screen.findByRole('textbox', { name: /provider name/i })
    ).toHaveValue(updatedUdp.label);
  });
});
