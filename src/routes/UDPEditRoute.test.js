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
import { useStripes } from '@folio/stripes/core';

import harvesterImpls from '../../test/fixtures/harvesterImpls';
import udp from '../../test/fixtures/udp';
import renderWithIntl from '../../test/jest/helpers';
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

const renderUDPEditRoute = (stripes) => renderWithIntl(
  <MemoryRouter>
    <UDPEditRoute
      history={history}
      location={location}
      match={{ params: { id: udp.id } }}
      stripes={stripes}
    />
  </MemoryRouter>
);

describe('UDPEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateOptions = undefined;

    useOkapiKyQuery
      .mockReturnValueOnce({
        data: harvesterImpls[0],
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: udpData,
        isLoading: false,
      });

    useOkapiKyMutation.mockReturnValue({
      useUpdate: (options) => {
        updateOptions = options;

        return { mutateAsync };
      },
    });
  });

  test('saves the UDP and navigates to its view after successful update', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), ' edited');
    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());

    updateOptions.onSuccess();

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
  });

  test('navigates to the UDP view when the form is closed', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(history.push).toHaveBeenCalledWith(`/eusage/view/${udp.id}?sort=label`);
  });
});
