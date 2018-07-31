import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pane from '@folio/stripes-components/lib/Pane';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import TitleManager from '../../../../stripes-core/src/components/TitleManager';

import HarvestingConfiguration from '../ViewSections/HarvestingConfiguration/HarvestingConfiguration';

class UsageDataProvidersView extends React.Component {
  static manifest = Object.freeze({
    query: {},
    usageDataProvider: {
      type: 'okapi',
      path: 'usage-data-providers/:{id}',
      pk: 'id'
    }
  });

  static propTypes = {
    stripes: PropTypes
      .shape({
        hasPerm: PropTypes.func.isRequired,
        connect: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
        logger: PropTypes
          .shape({ log: PropTypes.func.isRequired })
          .isRequired,
        intl: PropTypes.object.isRequired
      })
      .isRequired,
    paneWidth: PropTypes.string,
    resources: PropTypes.shape({
      usageDataProvider: PropTypes.shape(),
      query: PropTypes.object,
    }),
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    notesToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      accordions: {
        harvestingAccordion: true,
        uploadAccordion: false,
      },
    };

    this.log('UDPView');
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  render() {
    const records = (this.props.resources.usageDataProvider || {}).records || [];
    const udp = records.length
      ? records[0]
      : {};

    const detailMenu = (
      <PaneMenu>
        <IfPermission perm={this.props.newRecordPerms}>
          <IconButton
            icon="trashBin"
            id="clickable-deleteorganization"
            style={{
            visibility: !udp
              ? 'hidden'
              : 'visible'
          }}
            onClick={() => ''}
            title="Delete Organization"
          />
        </IfPermission>
        <IconButton
          icon="comment"
          id="clickable-show-notes"
          style={{
          visibility: !udp
            ? 'hidden'
            : 'visible'
        }}
          onClick={this.props.notesToggle}
          title="Show Notes"
        />
        <IfPermission perm={this.props.newRecordPerms}>
          <IconButton
            icon="edit"
            id="clickable-editorganization"
            style={{
            visibility: !udp
              ? 'hidden'
              : 'visible'
          }}
            onClick={this.props.onEdit}
            href={this.props.editLink}
            title="Edit Organization"
          />
        </IfPermission>
      </PaneMenu>
    );

    const vendorLink = udp.vendorName ? <Link to={`/vendors/view/${udp.vendorId}`}>{udp.vendorName}</Link> : '';

    return (
      <Pane
        id="pane-udpdetails"
        defaultWidth={this.props.paneWidth}
        paneTitle={udp.label}
        lastMenu={detailMenu}
        dismissible
        onClose={this.props.onClose}
      >
        <TitleManager record={udp.label} />
        <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
        <Row>
          <Col xs={3}>
            <KeyValue label="Content vendor" value={vendorLink} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Content platform" value={_.get(udp, 'platformId', 'N/A')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Harvesting" value={_.get(udp, 'harvestingStatus', 'N/A')} />
          </Col>
        </Row>
        <HarvestingConfiguration
          accordionId="harvestingAccordion"
          usageDataProvider={udp}
          expanded={this.state.accordions.harvestingAccordion}
          onToggle={this.handleAccordionToggle}
        />
        <Accordion
          open={this.state.accordions.uploadAccordion}
          onToggle={this.handleAccordionToggle}
          label="COUNTER file upload"
          id="uploadAccordion"
        >
          {
            <Row>
              <Col xs={3}>
                <KeyValue label="TODO" value="TODO" />
              </Col>
            </Row>
          }
        </Accordion>
      </Pane>
    );
  }
}

export default UsageDataProvidersView;
