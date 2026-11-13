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

import renderWithIntl from '../../test/jest/helpers';
import UDPEditRoute from './UDPEditRoute';

jest.mock('@folio/stripes-leipzig-components', () => ({
  ...jest.requireActual('@folio/stripes-leipzig-components'),
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
}));

const udp = {
  id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
  label: 'Provider',
  status: 'active',
  harvestingConfig: {
    harvestingStatus: 'inactive',
  },
};

const mutateAsync = jest.fn();

const renderUDPEditRoute = (stripes) => renderWithIntl(
  <MemoryRouter>
    <UDPEditRoute
      history={{ push: jest.fn() }}
      location={{ search: '' }}
      match={{ params: { id: udp.id } }}
      stripes={stripes}
    />
  </MemoryRouter>
);

describe('UDPEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKyQuery
      .mockReturnValueOnce({
        data: [],
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: udp,
        isLoading: false,
      });

    useOkapiKyMutation.mockReturnValue({
      useUpdate: () => ({
        mutateAsync,
      }),
    });
  });

  test('saves the UDP', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), ' edited');
    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
  });
});
