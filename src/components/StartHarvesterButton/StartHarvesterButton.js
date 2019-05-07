import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
} from '@folio/stripes/components';

export default class StartHarvesterButton extends React.Component {
  static manifest = Object.freeze({
    harvesterStart: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      GET: {
        path: 'erm-usage-harvester/start/!{usageDataProvider.id}',
      },
    }
  });

  static propTypes = {
    usageDataProvider: PropTypes.object.isRequired,
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
    const { usageDataProvider } = props;
    this.successText = `Harvester successfully started for '${usageDataProvider.label}'!`;
    this.failText = `Something went wrong while starting the harvester for usagedata provider ${usageDataProvider.label}...`;
  }

  componentDidUpdate(prevProps) {
    if (this.props.usageDataProvider.id !== prevProps.usageDataProvider.id) {
      this.successText = `Harvester successfully started for '${this.props.usageDataProvider.label}'!`;
      this.failText = `Something went wrong while starting the harvester for usagedata provider ${this.props.usageDataProvider.label}...`;
    }
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
    return (
      <React.Fragment>
        <Button
          onClick={() => this.onClickStartHarvester()}
        >
          { 'Start harvester' }
        </Button>
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
      </React.Fragment>
    );
  }
}
