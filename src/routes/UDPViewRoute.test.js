import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import routeProps from '../../test/fixtures/routeProps';
import renderWithIntl from '../../test/jest/helpers';
import UDPViewRoute from './UDPViewRoute';

const renderUDPViewRoute = (stripes) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <UDPViewRoute {...routeProps} stripes={stripes} />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('UDPViewRoute', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    routeProps.mutator.usageDataProvider.DELETE.mockClear();
    routeProps.history.push.mockClear();
  });

  describe('Delete UDP', () => {
    test('calls handleDelete with UDP id and navigates to UDP list', async () => {
      renderUDPViewRoute(stripes);

      await userEvent.click(screen.getByText('Actions'));
      await userEvent.click(screen.getByText('Delete'));

      const deleteModal = screen.getByRole('dialog', { name: /Do you really want to delete/ });
      await userEvent.click(within(deleteModal).getByRole('button', { name: 'Delete' }));

      expect(routeProps.mutator.usageDataProvider.DELETE).toHaveBeenCalledWith({ id: routeProps.match.params.id });
      await waitFor(() => expect(routeProps.history.push).toHaveBeenCalledWith('/eusage'));
    });
  });
});
