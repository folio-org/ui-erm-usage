import React from 'react';
import { act, render } from '@testing-library/react';
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

const register = jest.fn();
const deregister = jest.fn();

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

jest.mock('./index', () => {
  return () => <span>eUsage</span>;
});

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

describe('Application root', () => {
  it('should render without crashing', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ErmUsage match={match} register={register} deregister={deregister} />
      </MemoryRouter>
    );
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
    expect(getByText('eUsage')).toBeDefined();
  });
});
