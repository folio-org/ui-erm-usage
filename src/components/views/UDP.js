import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';

import { IfPermission, TitleManager, Pluggable, withOkapiKy } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Callout,
  Col,
  ExpandAllButton,
  collapseAllSections,
  expandAllSections,
  HasCommand,
  Icon,
  Layout,
  Pane,
  PaneHeader,
  PaneHeaderIconButton,
  PaneMenu,
  Row,
  Headline,
} from '@folio/stripes/components';
import {
  NotesSmartAccordion,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import HelperApp from '../HelperApp';

import { UDPInfoView } from '../UDPInfo';
import { HarvestingConfigurationView } from '../HarvestingConfiguration';
import CounterUpload from '../ReportUpload/CounterUpload';
import NonCounterUpload from '../ReportUpload/NonCounterUpload';
import CounterStatistics from '../Counter';
import CustomStatistics from '../Custom';
import DeleteStatisticsModal from '../DeleteStatisticsModal';

import urls from '../../util/urls';
import groupReportsPerYear from '../../util/groupReportsPerYear';
import createStandardReportFormatter from '../Counter/StandardReportFormatter';
import UDPHeader from '../UDPHeader/UDPHeader';
import HarvesterInfoModal from '../HarvesterInfoModal/HarvesterInfoModal';

let callout;

class UDP extends React.Component {
  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();

    this.state = {
      helperApp: null,
      showDeleteReports: false,
      harvesterModalState: {},
      showCounterUpload: false,
      showNonCounterUpload: false,
    };

    callout = React.createRef();
  }

  handleSuccess = (msg) => {
    const success = this.props.intl.formatMessage({
      id: 'ui-erm-usage.report.upload.success',
    });
    callout.sendCallout({
      message: `${success} ${msg}`,
    });
    this.setState({
      showCounterUpload: false,
      showNonCounterUpload: false,
      showDeleteReports: false,
    });
    this.reloadStatistics();
  };

  handleFail = (msg) => {
    const failText = this.props.intl.formatMessage({
      id: 'ui-erm-usage.report.upload.failed',
    });
    callout.sendCallout({
      type: 'error',
      message: `${failText} ${msg}`,
      timeout: 0,
    });
    this.setState({
      showCounterUpload: false,
      showNonCounterUpload: false,
      showDeleteReports: false,
    });
  };

  getInitialAccordionsState = () => {
    return {
      harvestingAccordion: false,
      sushiCredsAccordion: false,
      uploadAccordion: false,
      notesAccordion: false,
      counterStatisticsAccordion: false,
      nonCounterStatisticsAccordion: false,
    };
  };

  showHelperApp = (helperName) => {
    this.setState({
      helperApp: helperName,
    });
  };

  closeHelperApp = () => {
    this.setState({
      helperApp: null,
    });
  };

  reloadUdp = () => {
    const oldCount = this.props.udpReloadCount;
    this.props.mutator.udpReloadToggle.replace(oldCount + 1);
  };

  reloadStatistics = () => {
    const oldCount = this.props.statsReloadCount;
    this.props.mutator.statsReloadToggle.replace(oldCount + 1);
  };

  doShowDeleteReports = () => {
    this.setState({
      showDeleteReports: true,
    });
  };

  doCloseDeleteReports = () => {
    this.setState({
      showDeleteReports: false,
    });
  };

  renderDetailMenu = (udp) => {
    const { tagsEnabled } = this.props;

    const tags = ((udp && udp.tags) || {}).tagList || [];

    return (
      <PaneMenu>
        {tagsEnabled && (
          <FormattedMessage id="ui-erm-usage.showTags">
            {(ariaLabel) => (
              <PaneHeaderIconButton
                icon="tag"
                id="clickable-show-tags"
                onClick={() => {
                  this.showHelperApp('tags');
                }}
                badgeCount={tags.length}
                aria-label={typeof ariaLabel === 'string' ? ariaLabel : ariaLabel[0]}
              />
            )}
          </FormattedMessage>
        )}
      </PaneMenu>
    );
  };

  isInActive = (udp) => {
    const status = get(udp, 'harvestingConfig.harvestingStatus', 'inactive');
    return !this.props.isHarvesterExistent || status === 'inactive';
  };

  openStartHarvesterModal = (udpId) => {
    this.props
      .okapiKy(`erm-usage-harvester/start/${udpId}`, {
        method: 'GET',
        retry: 0,
      })
      .then(() => {
        this.setState({ harvesterModalState: { open: true, isSuccess: true } });
        this.reloadUdp();
      })
      .catch((error) => {
        Promise.resolve(error.response?.text?.() ?? error.message)
          .catch(() => error.message)
          .then((errMessage) => this.setState({
            harvesterModalState: { open: true, isSuccess: false, errMessage }
          }));
      });
  };

  closeStartHarvesterModal = () => {
    this.setState({ harvesterModalState: { open: false } });
  };

  getActionMenu = () => ({ onToggle }) => {
    const { canEdit, handlers, data, location } = this.props;
    const usageDataProvider = get(data, 'usageDataProvider', {});
    const providerId = get(usageDataProvider, 'id', '');
    const providerLabel = get(usageDataProvider, 'label', '');

    return (
      <>
        <div>
          <IfPermission perm="ui-erm-usage-harvester.start.single">
            <Button
              buttonStyle="dropDownItem"
              id="start-harvester-button"
              marginBottom0
              disabled={this.isInActive(usageDataProvider)}
              onClick={() => {
                this.openStartHarvesterModal(usageDataProvider.id);
                onToggle();
              }}
            >
              <Icon icon="play">
                <FormattedMessage id="ui-erm-usage.harvester.start" />
              </Icon>
            </Button>
          </IfPermission>
          <HarvesterInfoModal
            {...this.state.harvesterModalState}
            udpLabel={usageDataProvider.label}
            onClose={this.closeStartHarvesterModal}
          />
        </div>
        <div>
          <IfPermission perm="ui-erm-usage-harvester.jobs.view">
            <Button
              buttonStyle="dropDownItem"
              id="clickable-harvester-logs"
              marginBottom0
              to={{
                pathname: urls.jobsView,
                search: '?providerId=' + providerId + '&sort=-startedAt',
                state: {
                  from: location.pathname + location.search,
                  provider: { id: providerId, label: providerLabel }
                },
              }}
            >
              <Icon icon="arrow-right">
                <FormattedMessage id="ui-erm-usage.harvester.jobs.show" />
              </Icon>
            </Button>
          </IfPermission>
        </div>
        <div>
          <Button
            id="clickable-refresh-statistics"
            buttonStyle="dropDownItem"
            onClick={() => {
              onToggle();
              this.reloadStatistics();
            }}
            aria-label="Edit usage data provider"
            marginBottom0
          >
            <Icon icon="refresh">
              <FormattedMessage id="ui-erm-usage.action.refreshStatistics" />
            </Icon>
          </Button>
        </div>
        <IfPermission perm="ui-erm-usage.reports.create">
          <div>
            <Button
              buttonStyle="dropDownItem"
              id="upload-counter-button"
              marginBottom0
              onClick={() => {
                this.setState({ showCounterUpload: true });
                onToggle();
              }}
            >
              <Icon icon="plus-sign">
                <FormattedMessage id="ui-erm-usage.statistics.counter.upload" />
              </Icon>
            </Button>
          </div>
          <div>
            <Button
              buttonStyle="dropDownItem"
              id="upload-non-counter-button"
              marginBottom0
              onClick={() => {
                this.setState({ showNonCounterUpload: true });
                onToggle();
              }}
            >
              <Icon icon="plus-sign">
                <FormattedMessage id="ui-erm-usage.statistics.custom.upload" />
              </Icon>
            </Button>
          </div>
        </IfPermission>
        <IfPermission perm="ui-erm-usage.reports.delete">
          <div>
            <Button
              id="clickable-delete-reports"
              buttonStyle="dropDownItem"
              onClick={() => {
                onToggle();
                this.doShowDeleteReports();
              }}
              aria-label="Delete reports"
              marginBottom0
            >
              <Icon icon="trash">
                <FormattedMessage id="ui-erm-usage.statistics.multi.button" />
              </Icon>
            </Button>
          </div>
        </IfPermission>
        {canEdit && (
          <div>
            <Button
              id="clickable-edit-udp"
              buttonStyle="dropDownItem"
              onClick={() => { handlers.onEdit(); }}
              aria-label="Edit usage data provider"
              marginBottom0
            >
              <Icon icon="edit">
                <FormattedMessage id="ui-erm-usage.general.edit" />
              </Icon>
            </Button>
          </div>
        )}
      </>
    );
  };

  handleEdit = () => {
    if (this.props.canEdit) {
      this.props.handlers.onEdit();
    }
  };

  shortcuts = [
    {
      name: 'edit',
      handler: this.handleEdit,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, this.accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, this.accordionStatusRef),
    },
    {
      name: 'close',
      handler: () => this.handleCloseModal(),
    },
  ];

  renderLoadingPaneHeader = () => (
    <PaneHeader
      dismissible
      onClose={this.props.handlers.onClose}
      paneTitle={<span data-test-collection-header-title>loading</span>}
    />
  );

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={() => this.renderLoadingPaneHeader()}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  getCounterStatistics(reports, label, providerId, maxFailedAttempts) {
    const { data, handlers, stripes } = this.props;
    if (this.props.isStatsLoading) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }
    if (data.counterReports.length > 0) {
      const reportFormatter = createStandardReportFormatter(
        handlers,
        maxFailedAttempts,
        stripes,
        label
      );
      return (
        <CounterStatistics
          stripes={stripes}
          providerId={providerId}
          udpLabel={label}
          reports={reports}
          handlers={handlers}
          reportFormatter={reportFormatter}
          showMultiMonthDownload
        />
      );
    } else {
      return <FormattedMessage id="ui-erm-usage.statistics.noStats" />;
    }
  }

  getCustomStatistics(label, providerId) {
    const { data, handlers, stripes } = this.props;
    if (this.props.isStatsLoading) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }
    if (data.customReports.length > 0) {
      return (
        <CustomStatistics
          stripes={stripes}
          providerId={providerId}
          udpLabel={label}
          customReports={data.customReports}
          handlers={handlers}
        />
      );
    } else {
      return <FormattedMessage id="ui-erm-usage.statistics.noStats" />;
    }
  }

  renderDetailPaneHeader = (usageDataProvider, label) => (
    <PaneHeader
      actionMenu={this.getActionMenu()}
      dismissible
      lastMenu={this.renderDetailMenu(usageDataProvider)}
      onClose={this.props.handlers.onClose}
      paneTitle={<span data-test-header-title>{label}</span>}
    />
  );

  render() {
    const { data, isLoading, isStatsLoading, handlers, stripes } = this.props;

    const { helperApp } = this.state;

    const usageDataProvider = get(data, 'usageDataProvider', {});
    if (isLoading) return this.renderLoadingPane();

    const label = get(usageDataProvider, 'label', 'No LABEL');
    const providerId = get(usageDataProvider, 'id', '');
    const counterReportsPerYear = groupReportsPerYear(data.counterReports);
    const maxFailedAttempts = get(data, 'maxFailedAttempts', 5);

    if (isEmpty(usageDataProvider)) {
      return <div id="pane-udpdetails">Loading...</div>;
    } else {
      return (
        <HasCommand
          commands={this.shortcuts}
          scope={document.body}
        >
          <>
            <Pane
              id="pane-udpdetails"
              defaultWidth="40%"
              renderHeader={() => this.renderDetailPaneHeader(usageDataProvider, label)}
            >
              <TitleManager record={label} stripes={stripes} />
              <UDPHeader usageDataProvider={data.usageDataProvider} lastJob={data.lastJob} />
              <Headline size="xx-large" tag="h2">
                {label}
              </Headline>
              <ViewMetaData
                metadata={get(usageDataProvider, 'metadata', {})}
                stripes={stripes}
              />
              <UDPInfoView
                id="udpInfo"
                usageDataProvider={usageDataProvider}
                stripes={stripes}
              />
              <AccordionStatus ref={this.accordionStatusRef}>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton id="clickable-expand-all-view" />
                  </Col>
                </Row>
                <AccordionSet initialStatus={this.getInitialAccordionsState()}>
                  <Accordion
                    label={
                      <FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />
                    }
                    id="harvestingAccordion"
                  >
                    <HarvestingConfigurationView
                      usageDataProvider={usageDataProvider}
                      stripes={stripes}
                      settings={data.settings}
                      harvesterImpls={data.harvesterImpls}
                    />
                  </Accordion>
                  <Pluggable type="ui-agreements-extension" data={{ op: 'match-names', data }} />
                  <Accordion
                    id="counterStatisticsAccordion"
                    label={
                      <FormattedMessage id="ui-erm-usage.udp.counterStatistics" />
                    }
                  >
                    {this.getCounterStatistics(
                      counterReportsPerYear,
                      label,
                      providerId,
                      maxFailedAttempts
                    )}
                  </Accordion>
                  <Accordion
                    id="nonCounterStatisticsAccordion"
                    label={
                      <FormattedMessage id="ui-erm-usage.udp.nonCounterStatistics" />
                    }
                  >
                    {this.getCustomStatistics(label, providerId)}
                  </Accordion>
                  <NotesSmartAccordion
                    id="notesAccordion"
                    domainName="erm-usage"
                    entityId={usageDataProvider.id}
                    entityName={usageDataProvider.label}
                    entityType="erm-usage-data-provider"
                    pathToNoteCreate={urls.noteCreate()}
                    pathToNoteDetails={urls.notes()}
                    stripes={stripes}
                  />
                </AccordionSet>
              </AccordionStatus>
            </Pane>
            {helperApp && (
              <HelperApp appName={helperApp} onClose={this.closeHelperApp} />
            )}
            <DeleteStatisticsModal
              handlers={handlers}
              isStatsLoading={isStatsLoading}
              maxFailedAttempts={maxFailedAttempts}
              onCloseModal={this.doCloseDeleteReports}
              open={this.state.showDeleteReports}
              onFail={this.handleFail}
              onSuccess={this.handleSuccess}
              providerId={providerId}
              stripes={stripes}
              counterReports={counterReportsPerYear}
              udpLabel={label}
            />
            <CounterUpload
              open={this.state.showCounterUpload}
              onClose={() => this.setState({ showCounterUpload: false })}
              onFail={this.handleFail}
              onSuccess={this.handleSuccess}
              stripes={this.props.stripes}
              udpId={providerId}
            />
            <NonCounterUpload
              open={this.state.showNonCounterUpload}
              onClose={() => this.setState({ showNonCounterUpload: false })}
              onFail={this.handleFail}
              onSuccess={this.handleSuccess}
              stripes={this.props.stripes}
              udpId={providerId}
            />
            <Callout
              ref={(ref) => {
                callout = ref;
              }}
            />
          </>
        </HasCommand>
      );
    }
  }
}

UDP.propTypes = {
  canEdit: PropTypes.bool,
  data: PropTypes.shape({
    counterReports: PropTypes.arrayOf(PropTypes.shape()),
    customReports: PropTypes.arrayOf(PropTypes.shape()),
    harvesterImpls: PropTypes.arrayOf(PropTypes.shape()),
    maxFailedAttempts: PropTypes.number,
    settings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    usageDataProvider: PropTypes.object,
    lastJob: PropTypes.object,
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  intl: PropTypes.object,
  isHarvesterExistent: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  mutator: PropTypes.shape({
    udpReloadToggle: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    statsReloadToggle: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  udpReloadCount: PropTypes.number.isRequired,
  stripes: PropTypes.object.isRequired,
  tagsEnabled: PropTypes.bool,
  statsReloadCount: PropTypes.number.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  okapiKy: PropTypes.func.isRequired,
};

export default injectIntl(withOkapiKy(UDP));
