import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage
} from 'react-intl';
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
        path: 'erm-usage-harvester/start',
      },
    }
  });

  static propTypes = {
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

    this.successText = <FormattedMessage id="ui-erm-usage.settings.harvester.start.success" />;
    this.failText = <FormattedMessage id="ui-erm-usage.settings.harvester.start.fail" />;
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
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={<FormattedMessage id="ui-erm-usage.harvester.start" />}
      >
        <div>
          {<FormattedMessage id="ui-erm-usage.settings.harvester.start.tenant" />}
          { startHarvesterButton }
        </div>
        <Modal
          closeOnBackgroundClick
          open={this.state.showInfoModal}
          label={<FormattedMessage id="ui-erm-usage.harvester.start.started" />}
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
