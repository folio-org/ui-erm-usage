import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch } from 'react-router-dom';
import {
  AppContextMenu,
  Route,
} from '@folio/stripes/core';
import {
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
  CommandList,
  HasCommand,
  StripesOverlayWrapper
} from '@folio/stripes/components';

import pkg from '../package';
import commands from './commands';
import UDPsRoute from './routes/UDPsRoute';
import UDPViewRoute from './routes/UDPViewRoute';
import UDPCreateRoute from './routes/UDPCreateRoute';
import UDPEditRoute from './routes/UDPEditRoute';
import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteEditRoute from './routes/NoteEditRoute';
import NoteViewRoute from './routes/NoteViewRoute';
import JobsViewRoute from './routes/JobsViewRoute';
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
      handler: focusSearchField
    },
    {
      name: 'openShortcutModal',
      handler: changeKeyboardShortcutsModal
    },
  ];

  const shortcutScope = document.body;

  if (showSettings) {
    return <Settings match={match} {...props} />;
  }

  return (
    <StripesOverlayWrapper>
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
            <Route path={`${match.path}/notes/create`} component={NoteCreateRoute} />
            <Route path={`${match.path}/notes/:id/edit`} component={NoteEditRoute} />
            <Route path={`${match.path}/notes/:id`} component={NoteViewRoute} />
            <Route path={`${match.path}/create`} component={UDPCreateRoute} />
            <Route path={`${match.path}/:id/edit`} component={UDPEditRoute} />
            <Route path={`${match.path}/jobs`} component={JobsViewRoute} />
            <Route path={`${match.path}`} component={UDPsRoute}>
              <Route path={`${match.path}/view/:id`} component={UDPViewRoute} />
            </Route>
          </Switch>
        </HasCommand>
      </CommandList>
      { showKeyboardShortcutsModal && (
        <KeyboardShortcutsModal
          open
          onClose={() => { changeKeyboardShortcutsModal(false); }}
          allCommands={commands}
        />
      )}
    </StripesOverlayWrapper>
  );
};

ErmUsage.propTypes = {
  history: PropTypes.object,
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool
};

export default ErmUsage;
