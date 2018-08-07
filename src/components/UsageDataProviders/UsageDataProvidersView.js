import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pane from '@folio/stripes-components/lib/Pane';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import Layer from '@folio/stripes-components/lib/Layer';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import TitleManager from '../../../../stripes-core/src/components/TitleManager';

import UsageDataProviderForm from './UsageDataProviderForm';
import HarvestingConfiguration from '../ViewSections/HarvestingConfiguration/HarvestingConfiguration';
import SushiCredentials from '../ViewSections/SushiCredentials/SushiCredentials';

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
    mutator: PropTypes.shape({
      usageDataProvider: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
      query: PropTypes.object.isRequired,
    }),
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    onCloseEdit: PropTypes.func,
    notesToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      accordions: {
        harvestingAccordion: true,
        sushiCredsAccordion: false,
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

  update = (udp) => {
    // const reports = udp.requestedReports;
    // const filtered = _.keys(_.pickBy(reports));
    // udp.requestedReports = filtered;
    // console.log('Filtered Reports: ' + filtered);
    this.props.mutator.usageDataProvider.PUT(udp).then(() => {
      this.props.onCloseEdit();
    });
  }

  getUdpFormData = (udp) => {
    const udpFormData = udp ? _.cloneDeep(udp) : udp;
    return udpFormData;
  }

  render() {
    const { resources, stripes } = this.props;
    const query = resources.query;
    const records = (resources.usageDataProvider || {}).records || [];
    const udp = records.length
      ? records[0]
      : {};
    const udpFormData = this.getUdpFormData(udp);

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

    const vendorLink = udp.vendorId ? <Link to={`/vendors/view/${udp.vendorId}`}>{udp.vendorId}</Link> : '';

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
            <KeyValue label="Content platform" value={_.get(udp, 'platformId', '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Harvesting" value={_.get(udp, 'harvestingStatus', '')} />
          </Col>
        </Row>
        <HarvestingConfiguration
          accordionId="harvestingAccordion"
          usageDataProvider={udp}
          expanded={this.state.accordions.harvestingAccordion}
          onToggle={this.handleAccordionToggle}
        />
        <SushiCredentials
          accordionId="sushiCredsAccordion"
          usageDataProvider={udp}
          expanded={this.state.accordions.sushiCredsAccordion}
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

        <Layer isOpen={query.layer ? query.layer === 'edit' : false} contentLabel="Edit Usage Data Provider Dialog">
          <UsageDataProviderForm
            stripes={stripes}
            initialValues={udpFormData}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={{
              ...this.props.resources,
              ...this.props.parentResources,
            }}
            parentMutator={this.props.parentMutator}
          />
        </Layer>
      </Pane>
    );
  }
}

export default UsageDataProvidersView;
