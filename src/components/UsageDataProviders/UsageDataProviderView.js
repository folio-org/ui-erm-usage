import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Col,
  Accordion,
  ExpandAllButton,
  Icon,
  IconButton,
  Layer,
  Pane,
  PaneHeaderIconButton,
  PaneMenu,
  Row
} from '@folio/stripes/components';
import {
  IfInterface,
  IfPermission,
  TitleManager
} from '@folio/stripes/core';
import {
  withTags,
  NotesSmartAccordion
} from '@folio/stripes/smart-components';

import UsageDataProviderForm from './UsageDataProviderForm';
import { UDPInfoView } from '../UDPInfo';
import { HarvestingConfigurationView } from '../HarvestingConfiguration';
import Statistics from '../Statistics';
import StartHarvesterButton from '../StartHarvesterButton';
import ReportUpload from '../ReportUpload';

import extractHarvesterImpls from '../../util/HarvesterImpls';
import urls from '../../util/urls';

class UsageDataProviderView extends React.Component {
  static manifest = Object.freeze({
    query: {},
    settings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==ERM-USAGE and configName==hide_credentials)',
    },
    selUDP: {
      type: 'okapi',
      path: 'usage-data-providers/:{id}',
      clear: false,
      shouldRefresh: () => false,
    },
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
      })
      .isRequired,
    paneWidth: PropTypes.string,
    resources: PropTypes.shape({
      usageDataProvider: PropTypes.shape(),
      query: PropTypes.object,
      settings: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    mutator: PropTypes.shape({
      query: PropTypes.object.isRequired,
      selUDP: PropTypes.object.isRequired,
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
    tagsToggle: PropTypes.func,
    tagsEnabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.connectedUsageDataProviderForm = this.props.stripes.connect(UsageDataProviderForm);
    this.connectedStatistics = this.props.stripes.connect(Statistics);
    this.connectedStartHarvesterButton = this.props.stripes.connect(StartHarvesterButton);
    this.connectedReportUpload = this.props.stripes.connect(ReportUpload);

    this.state = {
      accordions: {
        harvestingAccordion: false,
        sushiCredsAccordion: false,
        uploadAccordion: false,
        notesAccordion: false,
        statisticsAccordion: false,
        notes: false,
      },
    };
  }

  getUDP = () => {
    const { resources, match: { params: { id } } } = this.props;
    const udp = (resources.selUDP || {}).records || [];

    if (udp.length === 0 || !id) return null;
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

  renderDetailMenu = (udp) => {
    const {
      tagsEnabled,
      tagsToggle,
      onEdit,
      editLink
    } = this.props;

    const tags = ((udp && udp.tags) || {}).tagList || [];

    return (
      <PaneMenu>
        {
          tagsEnabled &&
          <FormattedMessage id="ui-users.showTags">
            {ariaLabel => (
              <PaneHeaderIconButton
                icon="tag"
                id="clickable-show-tags"
                onClick={tagsToggle}
                badgeCount={tags.length}
                ariaLabel={ariaLabel}
              />
            )}
          </FormattedMessage>
        }
        <IfPermission perm="usagedataproviders.item.put">
          <IconButton
            icon="edit"
            id="clickable-edit-udp"
            style={{
              visibility: !udp
                ? 'hidden'
                : 'visible'
            }}
            onClick={onEdit}
            href={editLink}
            aria-label="Edit Usagedata Provider"
          />
        </IfPermission>
      </PaneMenu>
    );
  }

  render() {
    const { resources, parentResources, stripes } = this.props;
    const query = resources.query;
    const initialValues = this.getUDP();

    const harvesterImpls = extractHarvesterImpls(parentResources);

    const settings = (resources.settings || {}).records || [];

    const displayWhenOpenHarvestingAcc = (
      <IfInterface name="erm-usage-harvester">
        <this.connectedStartHarvesterButton usageDataProvider={initialValues} />
      </IfInterface>
    );

    if (_.isEmpty(initialValues)) {
      return <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>;
    } else {
      const udpFormData = this.getUdpFormData(initialValues);
      const detailMenu = this.renderDetailMenu(initialValues);

      const label = _.get(initialValues, 'label', 'No LABEL');
      const providerId = _.get(initialValues, 'id', '');
      return (
        <Pane
          id="pane-udpdetails"
          defaultWidth={this.props.paneWidth}
          paneTitle={<span data-test-header-title>{label}</span>}
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
                id="clickable-expand-all-view"
              />
            </Col>
          </Row>
          <UDPInfoView
            id="udpInfo"
            usageDataProvider={initialValues}
            stripes={this.props.stripes}
          />
          <Accordion
            open={this.state.accordions.harvestingAccordion}
            onToggle={this.handleAccordionToggle}
            label={<FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />}
            id="harvestingAccordion"
            displayWhenOpen={displayWhenOpenHarvestingAcc}
          >
            <HarvestingConfigurationView
              usageDataProvider={initialValues}
              stripes={this.props.stripes}
              sushiCredsOpen={this.state.accordions.sushiCredsAccordion}
              onToggle={this.handleAccordionToggle}
              settings={settings}
              harvesterImpls={harvesterImpls}
            />
          </Accordion>
          <Accordion
            open={this.state.accordions.statisticsAccordion}
            onToggle={this.handleAccordionToggle}
            label={<FormattedMessage id="ui-erm-usage.udp.statistics" />}
            id="statisticsAccordion"
          >
            <this.connectedStatistics
              stripes={stripes}
              providerId={providerId}
              udpLabel={label}
            />
          </Accordion>
          <Accordion
            open={this.state.accordions.uploadAccordion}
            onToggle={this.handleAccordionToggle}
            label={<FormattedMessage id="ui-erm-usage.udp.counterUpload" />}
            id="uploadAccordion"
          >
            <this.connectedReportUpload udpId={providerId} stripes={stripes} />
          </Accordion>
          <NotesSmartAccordion
            id="udpShowNotes"
            domainName="erm-usage"
            entityId={initialValues.id}
            entityName={initialValues.label}
            entityType="erm-usage-data-provider"
            pathToNoteCreate={urls.noteCreate()}
            pathToNoteDetails={urls.notes()}
            onToggle={this.handleAccordionToggle}
          />

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

export default withTags(UsageDataProviderView);
