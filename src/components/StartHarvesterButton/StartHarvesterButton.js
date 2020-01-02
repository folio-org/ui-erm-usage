import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import {
  Button,
  InfoPopover,
  Modal,
} from '@folio/stripes/components';

class StartHarvesterButton extends React.Component {
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
    intl: intlShape.isRequired,
    mutator: PropTypes.shape({
      harvesterStart: PropTypes.object,
    }),
    usageDataProvider: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showInfoModal: false,
      modalText: ''
    };
    const { usageDataProvider } = props;
    this.successText = this.createSuccessText(usageDataProvider);
    this.failText = this.createFailText(usageDataProvider);
  }

  componentDidUpdate(prevProps) {
    if (this.props.usageDataProvider.id !== prevProps.usageDataProvider.id) {
      this.successText = this.createSuccessText(this.props.usageDataProvider);
      this.failText = this.createFailText(this.props.usageDataProvider);
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

  isInActive = (udp) => {
    const status = get(udp, 'harvestingConfig.harvestingStatus', 'inactive');
    return status === 'inactive';
  }

  createSuccessText = (udp) => {
    return `${this.props.intl.formatMessage({ id: 'ui-erm-usage.harvester.start.success.single.udp' })} ${udp.label} !`;
  }

  createFailText = (udp) => {
    return `${this.props.intl.formatMessage({ id: 'ui-erm-usage.harvester.start.fail.single.udp' })} ${udp.label}...`;
  }

  renderInfoPopover = (udp) => {
    if (this.isInActive(udp)) {
      return (
        <InfoPopover
          content={<FormattedMessage id="ui-erm-usage.harvester.start.inactiveInfo" />}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { usageDataProvider } = this.props;
    return (
      <React.Fragment>
        <Button
          id="start-harvester-button"
          buttonStyle="primary"
          disabled={this.isInActive(usageDataProvider)}
          onClick={() => this.onClickStartHarvester()}
        >
          { <FormattedMessage id="ui-erm-usage.harvester.start" /> }
        </Button>
        { this.renderInfoPopover(usageDataProvider) }
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
      </React.Fragment>
    );
  }
}

export default injectIntl(StartHarvesterButton);
