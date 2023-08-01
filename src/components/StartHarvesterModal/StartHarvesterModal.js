import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { stripesConnect } from '@folio/stripes/core';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, InfoPopover, Modal } from '@folio/stripes/components';
import { Link } from 'react-router-dom';
import urls from '../../util/urls';

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

  isInActive = (udp) => {
    const status = get(udp, 'harvestingConfig.harvestingStatus', 'inactive');
    return !this.props.isHarvesterExistent || status === 'inactive';
  };

  createSuccessText = (udp) => {
    return <FormattedMessage
      id="ui-erm-usage.settings.harvester.start.success"
      values={{
        link: (
          <Link to={urls.jobsView + '?sort=-startedAt'}>
            <FormattedMessage id="ui-erm-usage.harvester.jobs.paneTitle" />
          </Link>
        ),
        provider: true,
        name: udp.label
      }}
    />;
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
