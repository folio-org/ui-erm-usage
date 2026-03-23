import {
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useRef,
  useState,
} from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Callout,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Headline,
  Icon,
  Layout,
  Pane,
  PaneHeader,
  PaneHeaderIconButton,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  IfPermission,
  Pluggable,
  TitleManager,
  withOkapiKy,
} from '@folio/stripes/core';
import {
  NotesSmartAccordion,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import transformReportsForMCL from '../../util/transformReportsForMCL';
import urls from '../../util/urls';
import CounterStatistics from '../Counter';
import createStandardReportFormatter from '../Counter/StandardReportFormatter';
import CustomStatistics from '../Custom';
import DeleteStatisticsModal from '../DeleteStatisticsModal';
import HarvesterInfoModal from '../HarvesterInfoModal/HarvesterInfoModal';
import { HarvestingConfigurationView } from '../HarvestingConfiguration';
import HelperApp from '../HelperApp';
import CounterUpload from '../ReportUpload/CounterUpload';
import NonCounterUpload from '../ReportUpload/NonCounterUpload';
import UDPHeader from '../UDPHeader/UDPHeader';
import { UDPInfoView } from '../UDPInfo';

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
                aria-label={typeof ariaLabel === 'string' ? ariaLabel : ariaLabel[0]}
                badgeCount={tags.length}
                icon="tag"
                id="clickable-show-tags"
                onClick={() => {
                  showHelperApp('tags');
                }}
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
          <IfPermission perm="ui-erm-usage.harvester.start.single">
            <Button
              buttonStyle="dropDownItem"
              disabled={isInActive(usageDataProvider)}
              id="start-harvester-button"
              marginBottom0
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
            onClose={closeStartHarvesterModal}
            udpLabel={usageDataProvider.label}
          />
        </div>
        <div>
          <IfPermission perm="ui-erm-usage.harvester.jobs.view">
            <Button
              buttonStyle="dropDownItem"
              id="clickable-harvester-logs"
              marginBottom0
              to={{
                pathname: urls.jobsView,
                search: '?providerId=' + providerId + '&sort=-startedAt',
                state: {
                  from: location.pathname + location.search,
                  provider: { id: providerId, label: providerLabel },
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
            aria-label="Edit usage data provider"
            buttonStyle="dropDownItem"
            id="clickable-refresh-statistics"
            marginBottom0
            onClick={() => {
              onToggle();
              reloadStatistics();
            }}
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
              aria-label="Delete reports"
              buttonStyle="dropDownItem"
              id="clickable-delete-reports"
              marginBottom0
              onClick={() => {
                onToggle();
                doShowDeleteReports();
              }}
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
              aria-label="Edit usage data provider"
              buttonStyle="dropDownItem"
              id="clickable-edit-udp"
              marginBottom0
              onClick={() => { handlers.onEdit(); }}
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
          handlers={handlers}
          providerId={providerId}
          reportFormatter={reportFormatter}
          reports={reports}
          showMultiMonthDownload
          stripes={stripes}
          udpLabel={label}
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
          customReports={data.customReports}
          handlers={handlers}
          providerId={providerId}
          stripes={stripes}
          udpLabel={label}
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
  const counterReportsByRelease = transformReportsForMCL(data.counterReports);
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
            defaultWidth="40%"
            id="pane-udpdetails"
            renderHeader={() => renderDetailPaneHeader(usageDataProvider, label)}
          >
            <TitleManager record={label} stripes={stripes} />
            <UDPHeader lastJob={data.lastJob} usageDataProvider={data.usageDataProvider} />
            <Headline size="xx-large" tag="h2">
              {label}
            </Headline>
            <ViewMetaData
              metadata={get(usageDataProvider, 'metadata', {})}
              stripes={stripes}
            />
            <UDPInfoView
              id="udpInfo"
              stripes={stripes}
              usageDataProvider={usageDataProvider}
            />
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton id="clickable-expand-all-view" />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
                <Accordion
                  id="harvestingAccordion"
                  label={
                    <FormattedMessage id="ui-erm-usage.udp.harvestingConfiguration" />
                  }
                >
                  <HarvestingConfigurationView
                    harvesterImpls={data.harvesterImpls}
                    settings={data.settings}
                    stripes={stripes}
                    usageDataProvider={usageDataProvider}
                  />
                </Accordion>
                <Pluggable data={{ op: 'match-names', data }} type="ui-agreements-extension" />
                <Accordion
                  id="counterStatisticsAccordion"
                  label={
                    <FormattedMessage id="ui-erm-usage.udp.counterStatistics" />
                  }
                >
                  {getCounterStatistics(
                    counterReportsByRelease,
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
                  domainName="erm-usage"
                  entityId={usageDataProvider.id}
                  entityName={usageDataProvider.label}
                  entityType="erm-usage-data-provider"
                  id="notesAccordion"
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
            counterReports={counterReportsByRelease}
            handlers={handlers}
            isStatsLoading={isStatsLoading}
            maxFailedAttempts={maxFailedAttempts}
            onCloseModal={doCloseDeleteReports}
            onFail={handleFail}
            onSuccess={handleSuccess}
            open={showDeleteReports}
            providerId={providerId}
            stripes={stripes}
            udpLabel={label}
          />
          <CounterUpload
            onClose={() => setShowCounterUpload(false)}
            onSuccess={handleSuccess}
            open={showCounterUpload}
            stripes={stripes}
            udpId={providerId}
          />
          <NonCounterUpload
            onClose={() => setShowNonCounterUpload(false)}
            onFail={handleFail}
            onSuccess={handleSuccess}
            open={showNonCounterUpload}
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
    lastJob: PropTypes.object,
    maxFailedAttempts: PropTypes.number,
    settings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    usageDataProvider: PropTypes.object,
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  intl: PropTypes.object,
  isHarvesterExistent: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  mutator: PropTypes.shape({
    statsReloadToggle: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    udpReloadToggle: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  okapiKy: PropTypes.func.isRequired,
  statsReloadCount: PropTypes.number.isRequired,
  stripes: PropTypes.object.isRequired,
  tagsEnabled: PropTypes.bool,
  udpReloadCount: PropTypes.number.isRequired,
};

export default injectIntl(withOkapiKy(UDP));
