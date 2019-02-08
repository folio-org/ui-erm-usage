import React from 'react';
import PropTypes from 'prop-types';
import { Pane } from '@folio/stripes/components';
import StartHavester from './StartHarvester';

class Harvester extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.cStartHarvester = this.props.stripes.connect(StartHavester);
  }

  renderNotPresent = () => {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="Required interface not present">
        <div>
          The interface usage-harvester is needed to start the harvester, but it is not present.
        </div>
      </Pane>
    );
  }

  render() {
    if (this.props.stripes.hasInterface('erm-usage-harvester')) {
      return <this.cStartHarvester {...this.props} />;
    } else {
      return this.renderNotPresent();
    }
  }
}

export default Harvester;
