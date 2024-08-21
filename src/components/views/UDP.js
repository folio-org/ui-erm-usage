import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
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

const UDP = ({
  canEdit,
  data,
  handlers,
  intl,
  isHarvesterExistent,
  isLoading,
  isStatsLoading,
  mutator,
  udpReloadCount,
  stripes,
  tagsEnabled,
  statsReloadCount,
  location,
  okapiKy,
}) => {
  const accordionStatusRef = useRef();
  callout = useRef();

  const [helperApp, setHelperApp] = useState(null);
  const [showDeleteReports, setShowDeleteReports] = useState(null);
  const [harvesterModalState, setHarvesterModalState] = useState({});
  const [showCounterUpload, setShowCounterUpload] = useState(false);
  const [showNonCounterUpload, setShowNonCounterUpload] = useState(false);

  const reloadStatistics = () => {
    const oldCount = statsReloadCount;
    mutator.statsReloadToggle.replace(oldCount + 1);
  };

  const handleSuccess = (msg) => {
    const success = intl.formatMessage({
      id: 'ui-erm-usage.report.upload.success',
    });
    callout.sendCallout({
      message: `${success} ${msg}`,
    });

    setShowCounterUpload(false);
    setShowNonCounterUpload(false);
    setShowDeleteReports(false);
    reloadStatistics();
  };

  const handleFail = (msg) => {
    const failText = intl.formatMessage({
      id: 'ui-erm-usage.report.upload.failed',
    });
    callout.sendCallout({
      type: 'error',
      message: `${failText} ${msg}`,
      timeout: 0,
    });

    setShowCounterUpload(false);
    setShowNonCounterUpload(false);
    setShowDeleteReports(false);
  };

  const getInitialAccordionsState = () => {
    return {
      harvestingAccordion: false,
      sushiCredsAccordion: false,
      uploadAccordion: false,
      notesAccordion: false,
      counterStatisticsAccordion: false,
      nonCounterStatisticsAccordion: false,
    };
  };

  const showHelperApp = (helperName) => {
    setHelperApp(helperName);
  };

  const closeHelperApp = () => {
    setHelperApp(null);
  };

  const reloadUdp = () => {
    const oldCount = udpReloadCount;
    mutator.udpReloadToggle.replace(oldCount + 1);
  };

  const doShowDeleteReports = () => {
    setShowDeleteReports(true);
  };

  const doCloseDeleteReports = () => {
    setShowDeleteReports(false);
  };

  const renderDetailMenu = (udp) => {
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
                  showHelperApp('tags');
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

  const isInActive = (udp) => {
    const status = get(udp, 'harvestingConfig.harvestingStatus', 'inactive');
    return !isHarvesterExistent || status === 'inactive';
  };

  const openStartHarvesterModal = (udpId) => {
    okapiKy(`erm-usage-harvester/start/${udpId}`, {
      method: 'GET',
      retry: 0,
    })
      .then(() => {
        setHarvesterModalState({ open: true, isSuccess: true });
        reloadUdp();
      })
      .catch((error) => {
        Promise.resolve(error.response?.text?.() ?? error.message)
          .catch(() => error.message)
          .then((errMessage) => setHarvesterModalState({ open: true, isSuccess: false, errMessage }));
      });
  };

  const closeStartHarvesterModal = () => {
    setHarvesterModalState({ open: false });
  };

  // eslint-disable-next-line react/prop-types
  const getActionMenu = () => ({ onToggle }) => {
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
              disabled={isInActive(usageDataProvider)}
              onClick={() => {
                openStartHarvesterModal(usageDataProvider.id);
                onToggle();
              }}
            >
              <Icon icon="play">
                <FormattedMessage id="ui-erm-usage.harvester.start" />
              </Icon>
            </Button>
          </IfPermission>
          <HarvesterInfoModal
            {...harvesterModalState}
            udpLabel={usageDataProvider.label}
            onClose={closeStartHarvesterModal}
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
              reloadStatistics();
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
                setShowCounterUpload(true);
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
                setShowNonCounterUpload(true);
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
                doShowDeleteReports();
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

  const handleEdit = () => {
    if (canEdit) {
      handlers.onEdit();
    }
  };

  const shortcuts = [
    {
      name: 'edit',
      handler: handleEdit,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'close',
      handler: () => handlers.onClose(),
      shortcut: 'esc',
    },
  ];

  const renderLoadingPaneHeader = () => (
    <PaneHeader
      dismissible
      onClose={handlers.onClose}
      paneTitle={<span data-test-collection-header-title>loading</span>}
    />
  );

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={() => renderLoadingPaneHeader()}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  const getCounterStatistics = (reports, label, providerId, maxFailedAttempts) => {
    if (isStatsLoading) {
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
  };

  const getCustomStatistics = (label, providerId) => {
    if (isStatsLoading) {
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
  };

  const renderDetailPaneHeader = (usageDataProvider, label) => (
    <PaneHeader
      actionMenu={getActionMenu()}
      dismissible
      lastMenu={renderDetailMenu(usageDataProvider)}
      onClose={handlers.onClose}
      paneTitle={<span data-test-header-title>{label}</span>}
    />
  );

  const usageDataProvider = get(data, 'usageDataProvider', {});
  if (isLoading) return renderLoadingPane();

  const label = get(usageDataProvider, 'label', 'No LABEL');
  const providerId = get(usageDataProvider, 'id', '');
  const counterReportsPerYear = groupReportsPerYear(data.counterReports);
  const maxFailedAttempts = get(data, 'maxFailedAttempts', 5);

  if (isEmpty(usageDataProvider)) {
    return <div id="pane-udpdetails">Loading...</div>;
  } else {
    return (
      <HasCommand
        commands={shortcuts}
        scope={document.body}
      >
        <>
          <Pane
            id="pane-udpdetails"
            defaultWidth="40%"
            renderHeader={() => renderDetailPaneHeader(usageDataProvider, label)}
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
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton id="clickable-expand-all-view" />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
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
                  {getCounterStatistics(
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
                  {getCustomStatistics(label, providerId)}
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
            <HelperApp appName={helperApp} onClose={closeHelperApp} />
          )}
          <DeleteStatisticsModal
            handlers={handlers}
            isStatsLoading={isStatsLoading}
            maxFailedAttempts={maxFailedAttempts}
            onCloseModal={doCloseDeleteReports}
            open={showDeleteReports}
            onFail={handleFail}
            onSuccess={handleSuccess}
            providerId={providerId}
            stripes={stripes}
            counterReports={counterReportsPerYear}
            udpLabel={label}
          />
          <CounterUpload
            open={showCounterUpload}
            onClose={() => setShowCounterUpload(false)}
            onFail={handleFail}
            onSuccess={handleSuccess}
            stripes={stripes}
            udpId={providerId}
          />
          <NonCounterUpload
            open={showNonCounterUpload}
            onClose={() => setShowNonCounterUpload(false)}
            onFail={handleFail}
            onSuccess={handleSuccess}
            stripes={stripes}
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
};

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
