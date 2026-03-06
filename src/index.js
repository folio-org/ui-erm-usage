import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';
import {
  AppContextMenu,
  Route,
} from '@folio/stripes/core';

import pkg from '../package';
import commands from './commands';
import JobsViewRoute from './routes/JobsViewRoute';
import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteEditRoute from './routes/NoteEditRoute';
import NoteViewRoute from './routes/NoteViewRoute';
import UDPCreateRoute from './routes/UDPCreateRoute';
import UDPEditRoute from './routes/UDPEditRoute';
import UDPsRoute from './routes/UDPsRoute';
import UDPViewRoute from './routes/UDPViewRoute';
import Settings from './settings';

const ErmUsage = ({
  history,
  match,
  showSettings,
  ...props
}) => {
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);

  const focusSearchField = () => {
    const el = document.getElementById('input-udp-search');

    if (el) {
      el.focus();
    } else {
      history.push(pkg.stripes.home);
    }
  };

  const checkScope = () => {
    return document.body.contains(document.activeElement);
  };

  const changeKeyboardShortcutsModal = (modalState) => {
    setShowKeyboardShortcutsModal(modalState);
  };

  const shortcutModalToggle = (handleToggle) => {
    handleToggle();
    changeKeyboardShortcutsModal(true);
  };

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
    {
      name: 'openShortcutModal',
      handler: changeKeyboardShortcutsModal,
    },
  ];

  const shortcutScope = document.body;

  if (showSettings) {
    return <Settings match={match} {...props} />;
  }

  return (
    <>
      <CommandList commands={commands}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={shortcutScope}
        >
          <AppContextMenu>
            {(handleToggle) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => { shortcutModalToggle(handleToggle); }}
                  >
                    <FormattedMessage id="ui-erm-usage.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Switch>
            <Route component={NoteCreateRoute} path={`${match.path}/notes/create`} />
            <Route component={NoteEditRoute} path={`${match.path}/notes/:id/edit`} />
            <Route component={NoteViewRoute} path={`${match.path}/notes/:id`} />
            <Route component={UDPCreateRoute} path={`${match.path}/create`} />
            <Route component={UDPEditRoute} path={`${match.path}/:id/edit`} />
            <Route component={JobsViewRoute} path={`${match.path}/jobs`} />
            <Route component={UDPsRoute} path={`${match.path}`}>
              <Route component={UDPViewRoute} path={`${match.path}/view/:id`} />
            </Route>
          </Switch>
        </HasCommand>
      </CommandList>
      { showKeyboardShortcutsModal && (
        <KeyboardShortcutsModal
          allCommands={commands}
          onClose={() => { changeKeyboardShortcutsModal(false); }}
          open
        />
      )}
    </>
  );
};

ErmUsage.propTypes = {
  history: PropTypes.object,
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
};

export default ErmUsage;
