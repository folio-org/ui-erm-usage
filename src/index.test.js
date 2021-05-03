import React from 'react';
import { act, screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { KeyboardShortcutsModal } from '@folio/stripes/components';
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

const renderKeyboardShortcutsModal = () => {
  return act(() => {
    renderWithIntl(
      <MemoryRouter>
        <KeyboardShortcutsModal
          open
          onClose={() => jest.fn()}
          allCommands={[{ name: 'new', label: 'New shortcut', shortcut: 'alt+n' }]}
        />
      </MemoryRouter>
    );
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
        <ErmUsage match={match} />
      </MemoryRouter>
    );
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
    expect(getByText('eUsage')).toBeDefined();
  });
});

describe('KeyboardShortcutsModal', () => {
  beforeEach(() => {
    stripes = useStripes();
    renderKeyboardShortcutsModal(stripes);
  });

  it('should render KeyboardShortcutsModal with shortcut', () => {
    expect(document.querySelector('#keyboard-shortcuts-modal')).toBeInTheDocument();
    expect(screen.getByText('New shortcut')).toBeInTheDocument();
  });
});
