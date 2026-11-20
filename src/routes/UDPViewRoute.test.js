import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import routeProps from '../../test/fixtures/routeProps';
import udp from '../../test/fixtures/udp';
import renderWithIntl from '../../test/jest/helpers';
import { API_UDPS } from '../util/constants';
import UDPViewRoute from './UDPViewRoute';

const renderUDPViewRoute = (stripes, props = routeProps) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <UDPViewRoute {...props} stripes={stripes} />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('UDPViewRoute', () => {
  let stripes;
  let ky;

  const mockGet = (promise) => {
    ky.get.mockReturnValue({
      json: jest.fn(() => promise),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    stripes = useStripes();

    ky = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    useOkapiKy.mockReturnValue(ky);

    mockGet(Promise.resolve(udp));

    routeProps.history.push.mockClear();
  });

  describe('UDP is not available', () => {
    test('shows the loading pane while a request is pending', () => {
      mockGet(new Promise(() => {}));

      renderUDPViewRoute(stripes);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
    });

    test('does not show UDP actions once the request has failed', async () => {
      mockGet(Promise.reject(new Error('UDP not found')));

      renderUDPViewRoute(stripes);

      await waitFor(() => {
        expect(screen.queryByText('Actions')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete UDP', () => {
    test('deletes the UDP and navigates to the UDP list', async () => {
      ky.delete.mockResolvedValue(new Response(null, { status: 204 }));

      renderUDPViewRoute(stripes);

      await screen.findByText('Actions');

      await userEvent.click(screen.getByText('Actions'));
      await userEvent.click(screen.getByText('Delete'));

      const deleteModal = screen.getByRole('dialog', { name: /Do you really want to delete/ });

      await userEvent.click(
        within(deleteModal).getByRole('button', { name: 'Delete' })
      );

      expect(ky.delete).toHaveBeenCalledWith(`${API_UDPS}/${routeProps.match.params.id}`, expect.anything());
      expect(routeProps.history.push).toHaveBeenCalledWith('/eusage');
    });
  });
});
