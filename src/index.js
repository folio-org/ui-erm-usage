import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';

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
      <Switch>
        <Route path={`${path}/udps/create`} component={UDPCreateRoute} />
        <Route path={`${path}/udps/:id/edit`} component={UDPEditRoute} />
        <Route path={`${path}/udps/:id?`} component={UDPsRoute}>
          <Route path={`${path}/udps/:id`} component={UDPViewRoute} />
        </Route>

        <Route path={`${path}/notes/create`} component={NoteCreateRoute} />
        <Route path={`${path}/notes/:id/edit`} component={NoteEditRoute} />
        <Route path={`${path}/notes/:id`} component={NoteViewRoute} />
      </Switch>
    );
  }
}

export default ErmUsage;
