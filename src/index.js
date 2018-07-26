import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Settings from './settings';
import UsageDataProviders from './components/UsageDataProviders/UsageDataProviders';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class ErmUsage extends React.Component {
  static propTypes = {
    stripes: PropTypes
      .shape({ connect: PropTypes.func.isRequired })
      .isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props
      .stripes
      .connect(UsageDataProviders);
  }

  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>How did you get to <tt>{this.props.location.pathname}</tt>?</p>
      </div>
    );
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedApp {...this.props} />}
        />
      </Switch>
    );
  }
}

export default ErmUsage;
