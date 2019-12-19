import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';

import UDPsRoute from './routes/UDPsRoute';
import UDPViewRoute from './routes/UDPViewRoute';
import UDPCreateRoute from './routes/UDPCreateRoute';
import UDPEditRoute from './routes/UDPEditRoute';
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
        <Route path={`${path}/create`} component={UDPCreateRoute} />
        <Route path={`${path}/:id/edit`} component={UDPEditRoute} />
        <Route path={`${path}/:id?`} component={UDPsRoute}>
          <Route path={`${path}/:id`} component={UDPViewRoute} />
        </Route>
      </Switch>
    );
  }
}

export default ErmUsage;
