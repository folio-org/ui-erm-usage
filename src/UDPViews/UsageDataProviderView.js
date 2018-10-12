import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import Layer from '@folio/stripes-components/lib/Layer';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';
import { Icon } from '@folio/stripes-components';

import UsageDataProviderForm from './UsageDataProviderForm';

import { UDPInfoView } from '../UDPInfo';
import { HarvestingConfigurationView } from '../HarvestingConfiguration';
import { SushiCredentialsView } from '../SushiCredentials';
import { NotesView } from '../Notes';
import StatisticsOverview from '../StatisticsOverview/StatisticsOverview';

class UsageDataProviderView extends React.Component {
  static manifest = Object.freeze({
    query: {},
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
      query: PropTypes.object.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    parentResources: PropTypes.shape(),
    parentMutator: PropTypes.shape().isRequired,
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
    this.connectedUsageDataProviderForm = this.props.stripes.connect(UsageDataProviderForm);
    this.connectedStatisticsOverview = this.props.stripes.connect(StatisticsOverview);

    this.state = {
      accordions: {
        harvestingAccordion: true,
        sushiCredsAccordion: false,
        uploadAccordion: false,
        notesAccordion: false,
        statisticsAccordion: false
      },
    };
  }

  getData = () => {
    const { parentResources, match: { params: { id } } } = this.props;
    const udp = (parentResources.records || {}).records || [];
    if (!udp || udp.length === 0 || !id) return null;
    return udp.find(u => u.id === id);
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
    this.props.parentMutator.records.PUT(udp).then(() => {
      this.props.onCloseEdit();
    });
  }

  getUdpFormData = (udp) => {
    const udpFormData = udp ? _.cloneDeep(udp) : udp;
    return udpFormData;
  }

  deleteUDP = (udp) => {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: udp.id })
      .then(() => {
        parentMutator.query.update({
          _path: '/ermusage',
          layer: null
        });
      });
  }

  render() {
    const { resources, stripes } = this.props;
    const query = resources.query;
    const initialValues = this.getData();

    if (_.isEmpty(initialValues)) {
      return <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>;
    } else {
      const udpFormData = this.getUdpFormData(initialValues);
      const detailMenu = (
        <PaneMenu>
          <IfPermission perm="usagedataproviders.item.delete">
            <IconButton
              icon="trashBin"
              id="clickable-deleteorganization"
              style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
              onClick={() => this.deleteUDP(initialValues)}
              title="Delete Organization"
            />
          </IfPermission>
          <IconButton
            icon="comment"
            id="clickable-show-notes"
            style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
            onClick={this.props.notesToggle}
            aria-label="Notes"
          />
          <IfPermission perm="usagedataproviders.item.put">
            <IconButton
              icon="edit"
              id="clickable-editorganization"
              style={{
                visibility: !initialValues
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

      const label = _.get(initialValues, 'label', 'No LABEL');
      const vendorId = _.get(initialValues, 'vendorId', '');
      const platformId = _.get(initialValues, 'platformId', '');

      return (
        <Pane
          id="pane-udpdetails"
          defaultWidth={this.props.paneWidth}
          paneTitle={label}
          lastMenu={detailMenu}
          dismissible
          onClose={this.props.onClose}
        >
          <TitleManager record={label} />
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={this.state.accordions}
                onToggle={this.handleExpandAll}
              />
            </Col>
          </Row>
          <UDPInfoView
            usageDataProvider={initialValues}
            stripes={this.props.stripes}
          />
          <Accordion
            open={this.state.accordions.harvestingAccordion}
            onToggle={this.handleAccordionToggle}
            label="Harvesting configuration"
            id="harvestingAccordion"
          >
            <HarvestingConfigurationView
              usageDataProvider={initialValues}
              stripes={this.props.stripes}
            />
          </Accordion>
          <Accordion
            open={this.state.accordions.sushiCredsAccordion}
            onToggle={this.handleAccordionToggle}
            label="SUSHI credentials"
            id="sushiCredsAccordion"
          >
            <SushiCredentialsView usageDataProvider={initialValues} />
          </Accordion>
          <Accordion
            open={this.state.accordions.notesAccordion}
            onToggle={this.handleAccordionToggle}
            label="Notes"
            id="notesAccordion"
          >
            <NotesView usageDataProvider={initialValues} />
          </Accordion>
          <Accordion
            open={this.state.accordions.statisticsAccordion}
            onToggle={this.handleAccordionToggle}
            label="Statistics"
            id="statisticsAccordion"
          >
            <this.connectedStatisticsOverview
              stripes={stripes}
              vendorId={vendorId}
              platformId={platformId}
            />
          </Accordion>
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

          <Layer
            isOpen={query.layer ? query.layer === 'edit' : false}
            contentLabel="Edit Usage Data Provider Dialog"
          >
            <this.connectedUsageDataProviderForm
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
}

export default UsageDataProviderView;
