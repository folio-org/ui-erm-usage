import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import {
  stripesConnect,
  withStripes,
} from '@folio/stripes/core';
import { Tags } from '@folio/stripes/smart-components';

import { API_UDPS } from '../../util/constants';

class HelperApp extends React.Component {
  static propTypes = {
    appName: PropTypes.string,
    match: PropTypes.object,
    onClose: PropTypes.func,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.helperApps = {
      tags: stripesConnect(Tags),
    };
  }

  renderHelperApp = () => {
    const {
      match: { params },
      appName,
      onClose,
    } = this.props;

    const HelperAppComponent = this.helperApps[appName];

    return (
      <HelperAppComponent
        link={`${API_UDPS}/${params.id}`}
        onToggle={onClose}
        {...this.props}
      />
    );
  };

  render() {
    return this.renderHelperApp();
  }
}

export default withRouter(withStripes(HelperApp));
