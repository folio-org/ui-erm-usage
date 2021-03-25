import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';
import {
  CommandList,
  HasCommand,
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
import Settings from './settings';

class ErmUsage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: ReactRouterPropTypes.match.isRequired,
    showSettings: PropTypes.bool
  };

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

  render() {
    const {
      showSettings,
      match: { path }
    } = this.props;

    this.shortcutScope = document.body;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <>
        <CommandList commands={commands}>
          <HasCommand
            commands={this.shortcuts}
            isWithinScope={this.checkScope}
            scope={this.shortcutScope}
          >
            <Switch>
              <Route path={`${path}/notes/create`} component={NoteCreateRoute} />
              <Route path={`${path}/notes/:id/edit`} component={NoteEditRoute} />
              <Route path={`${path}/notes/:id`} component={NoteViewRoute} />
              <Route path={`${path}/create`} component={UDPCreateRoute} />
              <Route path={`${path}/:id/edit`} component={UDPEditRoute} />
              <Route path={`${path}`} component={UDPsRoute}>
                <Route path={`${path}/view/:id`} component={UDPViewRoute} />
              </Route>
            </Switch>
          </HasCommand>
        </CommandList>
      </>
    );
  }
}

export default ErmUsage;
