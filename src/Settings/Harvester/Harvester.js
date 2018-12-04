import React from 'react';
import PropTypes from 'prop-types';
import { IfInterface } from '@folio/stripes/core';
import StartHavester from './StartHarvester';

class Harvester extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.cStartHarvester = this.props.stripes.connect(StartHavester);
  }

  render() {
    return (
      <IfInterface name="usage-harvester">
        <this.cStartHarvester {...this.props} />
      </IfInterface>
    );
  }
}

export default Harvester;
