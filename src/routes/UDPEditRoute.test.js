import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import {
  CalloutContext,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import harvesterImpls from '../../test/fixtures/harvesterImpls';
import udp from '../../test/fixtures/udp';
import renderWithIntl from '../../test/jest/helpers';
import { KEY_UDPS } from '../util/constants';
import UDPEditRoute from './UDPEditRoute';

jest.mock('@folio/stripes-leipzig-components', () => ({
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
  Monthpicker: () => null,
  NoPermissionMessage: () => null,
}));

const history = { push: jest.fn() };
const location = { search: '?sort=label' };
const mutateAsync = jest.fn();

let updateOptions;

const udpData = {
  ...udp,
  status: 'active',
};

const sendCallout = jest.fn();
const queryClient = new QueryClient();

const mockQueryResults = ({
  harvesterError,
  udpError,
  udpRecord = udpData,
} = {}) => {
  useOkapiKyQuery
    .mockReset()
    .mockReturnValueOnce({
      data: harvesterError ? undefined : harvesterImpls[0],
      error: harvesterError,
      isLoading: false,
    })
    .mockReturnValueOnce({
      data: udpError ? undefined : udpRecord,
      error: udpError,
      isLoading: false,
    });
};

const renderUDPEditRoute = (stripes) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <StripesContext.Provider value={stripes}>
      <CalloutContext.Provider value={{ sendCallout }}>
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
  </QueryClientProvider>
);

describe('UDPEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();

    jest.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(true);

    updateOptions = undefined;
    mutateAsync.mockReset();

    mockQueryResults();

    useOkapiKyMutation.mockReturnValue({
      useUpdate: (options) => {
        updateOptions = options;

        return { mutateAsync };
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('saves the UDP and navigates to its view after successful update', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), ' edited');
    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());

    await updateOptions.onSuccess();

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
  });

  test('navigates to the UDP view when the form is closed', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
  });

  test('shows an error and keeps the form open when updating the UDP fails', async () => {
    const error = new Error('Update failed');

    mutateAsync.mockRejectedValueOnce(error);

    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.type(
      screen.getByRole('textbox', { name: /provider name/i }),
      ' edited'
    );

    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => {
      expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
        type: 'error',
        message: expect.stringContaining(error.message),
      }));
    });

    expect(document.querySelector('#form-udp')).toBeInTheDocument();
    expect(history.push).not.toHaveBeenCalled();
  });

  test('shows updated UDP data when edit is reopened after saving', async () => {
    const updatedUdp = {
      ...udpData,
      label: 'Updated provider name',
    };

    const stripes = useStripes();
    const { unmount } = renderUDPEditRoute(stripes);

    const providerName = screen.getByRole('textbox', { name: /provider name/i });

    await userEvent.clear(providerName);
    await userEvent.type(providerName, updatedUdp.label);

    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    await updateOptions.onSuccess();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      KEY_UDPS,
      udp.id,
    ]);

    unmount();

    mockQueryResults({ udpRecord: updatedUdp });
    renderUDPEditRoute(stripes);

    expect(
      screen.getByRole('textbox', { name: /provider name/i })
    ).toHaveValue(updatedUdp.label);
  });
});
