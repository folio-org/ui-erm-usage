import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  Pane
} from '@folio/stripes/components';

export default class StartHarvester extends React.Component {
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

  constructor(props) {
    super(props);

    this.state = {
      showInfoModal: false,
      modalText: ''
    };

    this.successText = 'Harvester successfully started!';
    this.failText = 'Something went wrong while starting the harvester...';
  }

  onClickStartHarvester = () => {
    this.props.mutator.harvesterStart.GET()
      .then(() => {
        this.setState(
          {
            showInfoModal: true,
            modalText: this.successText
          }
        );
      })
      .catch(err => {
        const infoText = this.failText + ' ' + err.message;
        this.setState(
          {
            showInfoModal: true,
            modalText: infoText
          }
        );
      });
  }

  handleClose = () => {
    this.setState({ showInfoModal: false });
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
        <Modal
          closeOnBackgroundClick
          open={this.state.showInfoModal}
          label="Harvester started"
        >
          <div>
            { this.state.modalText }
          </div>
          <Button
            onClick={this.handleClose}
          >
            OK
          </Button>
        </Modal>
      </Pane>
    );
  }
}
