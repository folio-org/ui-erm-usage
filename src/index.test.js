import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { Button, KeyboardShortcutsModal } from '@folio/stripes/components';
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

const onClose = jest.fn();

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
          onClose={onClose}
          allCommands={[{ name: 'new', label: 'New shortcut', shortcut: 'alt+n' }]}
        >
          <Button>Close</Button>
        </KeyboardShortcutsModal>
      </MemoryRouter>
    );
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

describe('KeyboardShortcutsModal', () => {
  it('should render KeyboardShortcutsModal with shortcut', () => {
    renderKeyboardShortcutsModal();
    expect(document.querySelector('#keyboard-shortcuts-modal')).toBeInTheDocument();
    expect(screen.getByText('New shortcut')).toBeInTheDocument();
  });

  test('close KeyboardShortcutsModal', async () => {
    renderKeyboardShortcutsModal();
    expect(screen.getByText('Close')).toBeInTheDocument();

    userEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
