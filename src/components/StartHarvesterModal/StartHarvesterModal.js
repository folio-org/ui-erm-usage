import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, InfoPopover, Modal } from '@folio/stripes/components';

class StartHarvesterModal extends React.Component {
  static manifest = Object.freeze({
    harvesterStart: {
      type: 'okapi',
      fetch: false,
      accumulate: 'true',
      GET: {
        path: 'erm-usage-harvester/start/!{usageDataProvider.id}',
      },
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    isHarvesterExistent: PropTypes.bool,
    onReloadUDP: PropTypes.func.isRequired,
    mutator: PropTypes.shape({
      harvesterStart: PropTypes.object,
    }).isRequired,
    usageDataProvider: PropTypes.object.isRequired,
    onClose: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { usageDataProvider } = props;
    this.state = {
      modalText: '',
    };

    this.props.mutator.harvesterStart
      .GET()
      .then(() => {
        this.setState({
          modalText: this.createSuccessText(usageDataProvider),
        });
        this.props.onReloadUDP();
      })
      .catch((err) => {
        const infoText = this.createFailText(usageDataProvider) + ' ' + err.message;
        this.setState({
          modalText: infoText,
        });
      });
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.usageDataProvider.id !== prevProps.usageDataProvider.id) {
  //     this.successText = this.createSuccessText(this.props.usageDataProvider);
  //     this.failText = this.createFailText(this.props.usageDataProvider);
  //   }
  // }

  isInActive = (udp) => {
    const status = get(udp, 'harvestingConfig.harvestingStatus', 'inactive');
    return !this.props.isHarvesterExistent || status === 'inactive';
  };

  createSuccessText = (udp) => {
    return `${this.props.intl.formatMessage({
      id: 'ui-erm-usage.harvester.start.success.single.udp',
    })} ${udp.label} !`;
  };

  createFailText = (udp) => {
    return `${this.props.intl.formatMessage({
      id: 'ui-erm-usage.harvester.start.fail.single.udp',
    })} ${udp.label}...`;
  };

  renderInfoPopover = (udp) => {
    if (this.isInActive(udp)) {
      return (
        <InfoPopover
          content={
            <FormattedMessage id="ui-erm-usage.harvester.start.inactiveInfo" />
          }
        />
      );
    } else {
      return null;
    }
  };

  render() {
    const { usageDataProvider } = this.props;
    return (
      <>
        {this.renderInfoPopover(usageDataProvider)}
        <Modal
          closeOnBackgroundClick
          label={<FormattedMessage id="ui-erm-usage.harvester.start.started" />}
          open
        >
          <div>{this.state.modalText}</div>
          <Button onClick={this.props.onClose}>OK</Button>
        </Modal>
      </>
    );
  }
}

export default stripesConnect(injectIntl(StartHarvesterModal));
