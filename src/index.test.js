import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { useStripes } from '@folio/stripes/core';

import renderWithIntl from '../test/jest/helpers';
import ErmUsage from './index';
import UDPCreateRoute from './routes/UDPCreateRoute';
import UDPEditRoute from './routes/UDPEditRoute';

jest.mock('@folio/stripes-leipzig-components', () => ({
  ...jest.requireActual('@folio/stripes-leipzig-components'),
  useOkapiKyMutation: jest.fn(),
  useOkapiKyQuery: jest.fn(),
}));

const match = {
  isExact: false,
  params: {},
  path: '/eusage',
  url: '/eusage',
};

const editRouteProps = {
  history: {
    push: jest.fn(),
  },
  location: {
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
  resources: {
    harvesterImpls: {},
    usageDataProvider: {},
  },
};

const renderWithRouter = (component) => {
  renderWithIntl(
    <MemoryRouter>{component}</MemoryRouter>
  );
};

let stripes;
describe('index', () => {
  beforeEach(() => {
    stripes = useStripes();
  });

  it('should render UDPEditRoute', () => {
    renderWithRouter(<UDPEditRoute stripes={stripes} {...editRouteProps} />);
    expect(document.querySelector('#form-udp')).toBeInTheDocument();
  });

  it('should render UDPCreateRoute', () => {
    useOkapiKyQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    useOkapiKyMutation.mockReturnValue({
      useCreate: () => ({
        mutateAsync: jest.fn(),
      }),
    });

    renderWithRouter(<UDPCreateRoute stripes={stripes} {...editRouteProps} />);

    expect(document.querySelector('#form-udp')).toBeInTheDocument();
  });
});

describe('AppContextMenu', () => {
  it('should render AppContextMenu', () => {
    renderWithRouter(<ErmUsage match={match} />);
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
    expect(document.querySelector('#keyboard-shortcuts-item')).toBeInTheDocument();
  });
});
