import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import {
  Accordion,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Layout,
  Pane,
  PaneHeaderIconButton,
  PaneMenu,
  Row
} from '@folio/stripes/components';
import {
  NotesSmartAccordion,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import { UDPInfoView } from '../UDPInfo';
import { HarvestingConfigurationView } from '../HarvestingConfiguration';
import Statistics from '../Statistics';
import StartHarvesterButton from '../StartHarvesterButton';
import ReportUpload from '../ReportUpload';

import {
  calcStateExpandAllAccordions,
  calcStateToggleAccordion
} from '../../util/stateUtils';

import urls from '../utilities';

class UDP extends React.Component {
  constructor(props) {
    super(props);
    this.connectedViewMetaData = this.props.stripes.connect(ViewMetaData);
    this.connectedStartHarvesterButton = this.props.stripes.connect(
      StartHarvesterButton
    );
    this.connectedReportUpload = this.props.stripes.connect(ReportUpload);

    this.state = {
      accordions: {
        harvestingAccordion: false,
        sushiCredsAccordion: false,
        uploadAccordion: false,
        notesAccordion: false,
        statisticsAccordion: false
        // notes: false,
      }
    };
  }

  handleExpandAll = obj => {
    this.setState(curState => {
      return calcStateExpandAllAccordions(curState, obj);
    });
  };

  handleAccordionToggle = ({ id }) => {
    this.setState(state => {
      return calcStateToggleAccordion(state, id);
    });
  };

  renderDetailMenu = udp => {
    const { canEdit, tagsEnabled, handlers } = this.props;

    const tags = ((udp && udp.tags) || {}).tagList || [];

    return (
      <PaneMenu>
        {tagsEnabled && (
          <FormattedMessage id="ui-users.showTags">
            {ariaLabel => (
              <PaneHeaderIconButton
                icon="tag"
                id="clickable-show-tags"
                onClick={handlers.onToggleTags}
                badgeCount={tags.length}
                ariaLabel={ariaLabel}
              />
            )}
          </FormattedMessage>
        )}
        {canEdit && (
          <IconButton
            icon="edit"
            id="clickable-edit-udp"
            style={{
              visibility: !udp ? 'hidden' : 'visible'
            }}
            onClick={handlers.onEdit}
            // href={editLink}
            aria-label="Edit Usagedata Provider"
          />
        )}
      </PaneMenu>
    );
  };

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        dismissible
        id="pane-collectiondetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-collection-header-title>loading</span>}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  render() {
    const {
      data,
      isLoading,
      handlers,
      isHarvesterExistent,
      stripes
    } = this.props;
    const usageDataProvider = get(data, 'usageDataProvider', {}); // data.usageDataProvider;
    if (isLoading) return this.renderLoadingPane();

    // const query = resources.query;
    // const initialValues = this.getUDP();
    // const counterReports = this.getCounterReports();
    // const harvesterImpls = extractHarvesterImpls(parentResources);
    // const settings = (resources.settings || {}).records || [];

    // const displayWhenOpenHarvestingAcc = (
    //   <IfInterface name="erm-usage-harvester">
    //     <this.connectedStartHarvesterButton usageDataProvider={initialValues} />
    //   </IfInterface>
    // );

    const displayWhenOpenHarvestingAcc = isHarvesterExistent ? (
      <this.connectedStartHarvesterButton
        usageDataProvider={usageDataProvider}
      />
    ) : null;

    // const udpFormData = this.getUdpFormData(initialValues);
    const detailMenu = this.renderDetailMenu(usageDataProvider);

    const label = get(usageDataProvider, 'label', 'No LABEL');
    const providerId = get(usageDataProvider, 'id', '');
    return (
      <Pane
        id="pane-udpdetails"
        defaultWidth="40%"
        paneTitle={<span data-test-header-title>{label}</span>}
        lastMenu={detailMenu}
        dismissible
        onClose={handlers.onClose}
      >
        <TitleManager record={label} stripes={stripes} />
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={this.state.accordions}
              onToggle={this.handleExpandAll}
              id="clickable-expand-all-view"
            />
          </Col>
        </Row>
        <this.connectedViewMetaData
          metadata={get(usageDataProvider, 'metadata', {})}
          stripes={stripes}
        />
        <UDPInfoView
          id="udpInfo"
          usageDataProvider={usageDataProvider}
          stripes={stripes}
        />
        <Accordion
          open={this.state.accordions.harvestingAccordion}
          onToggle={this.handleAccordionToggle}
          label={
            <FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />
          }
          id="harvestingAccordion"
          displayWhenOpen={displayWhenOpenHarvestingAcc}
        >
          <HarvestingConfigurationView
            usageDataProvider={usageDataProvider}
            stripes={stripes}
            sushiCredsOpen={this.state.accordions.sushiCredsAccordion}
            onToggle={this.handleAccordionToggle}
            settings={data.settings}
            harvesterImpls={data.harvesterImpls}
          />
        </Accordion>
        <Accordion
          open={this.state.accordions.statisticsAccordion}
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-erm-usage.udp.statistics" />}
          id="statisticsAccordion"
        >
          <Statistics
            stripes={stripes}
            providerId={providerId}
            udpLabel={label}
            counterReports={data.counterReports}
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
          id="notesAccordion"
          domainName="erm-usage"
          entityId={usageDataProvider.id}
          entityName={usageDataProvider.label}
          entityType="erm-usage-data-provider"
          pathToNoteCreate={urls.noteCreate()}
          pathToNoteDetails={urls.notes()}
          onToggle={this.handleAccordionToggle}
          open={this.state.accordions.notesAccordion}
          stripes={stripes}
        />
      </Pane>
    );
  }
}

UDP.propTypes = {
  canEdit: PropTypes.bool,
  data: PropTypes.shape({
    counterReports: PropTypes.arrayOf(PropTypes.shape()),
    harvesterImpls: PropTypes.arrayOf(PropTypes.shape()),
    settings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    usageDataProvider: PropTypes.object
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onToggleTags: PropTypes.func
  }).isRequired,
  isHarvesterExistent: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  stripes: PropTypes.object.isRequired,
  tagsEnabled: PropTypes.bool,
};

export default UDP;
