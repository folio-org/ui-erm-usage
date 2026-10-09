import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import renderWithIntl from '../../test/jest/helpers';
import UDPEditRoute from './UDPEditRoute';

const udp = {
  id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
  label: 'Provider',
  status: 'active',
  harvestingConfig: {
    harvestingStatus: 'inactive',
  },
};

const PUT = jest.fn(() => Promise.resolve({ id: udp.id }));

const renderUDPEditRoute = (stripes) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <UDPEditRoute
        history={{ push: jest.fn() }}
        location={{ search: '' }}
        match={{ params: { id: udp.id } }}
        mutator={{ usageDataProvider: { PUT } }}
        resources={{
          harvesterImpls: { records: [] },
          usageDataProvider: { records: [udp] },
        }}
        stripes={stripes}
      />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('UDPEditRoute', () => {
  test('saves the UDP without harvestVia', async () => {
    const stripes = useStripes();
    renderUDPEditRoute(stripes);

    await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), ' edited');
    await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

    await waitFor(() => expect(PUT).toHaveBeenCalled());
    expect(PUT.mock.calls[0][0].harvestingConfig).not.toHaveProperty('harvestVia');
  });
});
