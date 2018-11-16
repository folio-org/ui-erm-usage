import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Pane
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export default class GeneralSettings extends React.Component {
  static manifest = Object.freeze({
    harvesterStart: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      GET: {
        path: 'harvester/start',
      },
    }
  });

  static propTypes = {
    label: PropTypes.string.isRequired,
    mutator: PropTypes.shape({
      harvesterStart: PropTypes.object,
    }),
  };

  onClickStartHarvester = () => {
    this.props.mutator.harvesterStart.GET().then(() => {
      console.log('Started harvester');
    });
  }

  render() {

    const startHarvesterButton = (
      <Button
        onClick={() => this.onClickStartHarvester()}
      >
        { 'Start harvesting' }
      </Button>
    );

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <div>
          {'Start the harvester for the current tenant: '}
          { startHarvesterButton }
        </div>
      </Pane>
    );
  }
}
