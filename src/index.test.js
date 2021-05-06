import React from 'react';
import { act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import renderWithIntl from '../test/jest/helpers';
import UDPEditRoute from './routes/UDPEditRoute';
import UDPCreateRoute from './routes/UDPCreateRoute';
import ErmUsage from './index';

const match = {
  isExact: false,
  params: {},
  path: '/eusage',
  url: '/eusage',
};

const editRouteProps = {
  history: {
    push: () => jest.fn(),
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
    aggregators: {},
    harvesterImpls: { },
    usageDataProvider: {}
  },
};

const renderWithRouter = (component) => {
  return act(() => {
    renderWithIntl(<MemoryRouter>{component}</MemoryRouter>);
  });
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
    renderWithRouter(<UDPCreateRoute stripes={stripes} {...editRouteProps} />);
    expect(document.querySelector('#form-udp')).toBeInTheDocument();
  });
});

describe('AppContextMenu', () => {
  it('should render AppContextMenu', () => {
    renderWithIntl(
      <MemoryRouter>
        <ErmUsage match={match} />
      </MemoryRouter>
    );
    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
    expect(document.querySelector('#keyboard-shortcuts-item')).toBeInTheDocument();
  });
});
