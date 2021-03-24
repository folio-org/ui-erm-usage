import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';
import {
  CommandList,
} from '@folio/stripes/components';

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
    match: ReactRouterPropTypes.match.isRequired,
    showSettings: PropTypes.bool
  };

  render() {
    const {
      showSettings,
      match: { path }
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <>
        <CommandList commands={commands}>
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
        </CommandList>
      </>
    );
  }
}

export default ErmUsage;
