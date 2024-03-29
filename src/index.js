import React from 'react';
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
} from '@folio/stripes/components';

import pkg from '../package';
import commands from './commands';
import commandsGeneral from './commandsGeneral';
import UDPsRoute from './routes/UDPsRoute';
import UDPViewRoute from './routes/UDPViewRoute';
import UDPCreateRoute from './routes/UDPCreateRoute';
import UDPEditRoute from './routes/UDPEditRoute';
import NoteCreateRoute from './routes/NoteCreateRoute';
import NoteEditRoute from './routes/NoteEditRoute';
import NoteViewRoute from './routes/NoteViewRoute';
import JobsViewRoute from './routes/JobsViewRoute';
import Settings from './settings';

class ErmUsage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: ReactRouterPropTypes.match.isRequired,
    showSettings: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      showKeyboardShortcutsModal: false,
    };
  }

  focusSearchField = () => {
    const { history } = this.props;
    const el = document.getElementById('input-udp-search');
    if (el) {
      el.focus();
    } else {
      history.push(pkg.stripes.home);
    }
  }

  checkScope = () => {
    return document.body.contains(document.activeElement);
  }

  shortcuts = [
    {
      name: 'search',
      handler: this.focusSearchField
    }
  ];

  shortcutModalToggle(handleToggle) {
    handleToggle();
    this.changeKeyboardShortcutsModal(true);
  }

  changeKeyboardShortcutsModal = (modalState) => {
    this.setState({ showKeyboardShortcutsModal: modalState });
  };

  render() {
    const {
      showSettings,
      match: { path }
    } = this.props;

    this.shortcutScope = document.body;
    const allCommands = commands.concat(commandsGeneral);

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <>
        <CommandList commands={allCommands}>
          <HasCommand
            commands={this.shortcuts}
            isWithinScope={this.checkScope}
            scope={this.shortcutScope}
          >
            <AppContextMenu>
              {(handleToggle) => (
                <NavList>
                  <NavListSection>
                    <NavListItem
                      id="keyboard-shortcuts-item"
                      onClick={() => { this.shortcutModalToggle(handleToggle); }}
                    >
                      <FormattedMessage id="ui-erm-usage.appMenu.keyboardShortcuts" />
                    </NavListItem>
                  </NavListSection>
                </NavList>
              )}
            </AppContextMenu>
            <Switch>
              <Route path={`${path}/notes/create`} component={NoteCreateRoute} />
              <Route path={`${path}/notes/:id/edit`} component={NoteEditRoute} />
              <Route path={`${path}/notes/:id`} component={NoteViewRoute} />
              <Route path={`${path}/create`} component={UDPCreateRoute} />
              <Route path={`${path}/:id/edit`} component={UDPEditRoute} />
              <Route path={`${path}/jobs`} component={JobsViewRoute} />
              <Route path={`${path}`} component={UDPsRoute}>
                <Route path={`${path}/view/:id`} component={UDPViewRoute} />
              </Route>
            </Switch>
          </HasCommand>
        </CommandList>
        { this.state.showKeyboardShortcutsModal && (
          <KeyboardShortcutsModal
            open
            onClose={() => { this.changeKeyboardShortcutsModal(false); }}
            allCommands={commands.concat(commandsGeneral)}
          />
        )}
      </>
    );
  }
}

export default ErmUsage;
