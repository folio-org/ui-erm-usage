import compose from 'compose-function';
import {
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';
import { CalloutContext } from '@folio/stripes/core';

import UDPView from '../components/views/UDP';
import {
  API_COUNTER_REPORTS_SORTED,
  API_CUSTOM_REPORTS,
  API_HARVESTER_IMPL,
  API_HARVESTER_JOBS,
  API_SETTINGS_ENTRIES,
  API_UDPS,
  KEY_COUNTER_REPORTS,
  KEY_CUSTOM_REPORTS,
  KEY_HARVESTER_IMPL,
  KEY_HARVESTER_JOBS,
  KEY_SETTINGS,
  KEY_UDPS,
  MAX_FAILED_ATTEMPTS,
  MOD_SETTINGS,
} from '../util/constants';
import showErrorInfo from '../util/showErrorInfo';
import urls from '../util/urls';
import withReportHandlers from './components/withReportHandlers';

const { SCOPES, CONFIG_NAMES } = MOD_SETTINGS;

function UDPViewRoute({
  handlers = {},
  history,
  location,
  match,
  stripes,
}) {
  const { id } = match.params;
  const callout = useContext(CalloutContext);
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const [statsReloadCount, setStatsReloadCount] = useState(0);

  const {
    data: tagSettingsData,
  } = useOkapiKyQuery({
    queryKey: ['tagSettings', SCOPES.TAGS],
    api: API_SETTINGS_ENTRIES,
    params: {
      query: `(scope==${SCOPES.TAGS} and key==tags_enabled)`,
    },
  });

  const tagsEnabled = (() => {
    const data = tagSettingsData?.items || [];
    if (!data.length) return true;
    return Boolean(data[0].value);
  })();

  const refreshUdpList = () => {
    stripes.store.dispatch({
      type: 'REFRESH',
      meta: {
        path: API_UDPS,
      },
    });
  };

  const {
    data: udpData,
    isLoading: isUdpLoading,
    error: udpError,
  } = useOkapiKyQuery({
    queryKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { useDelete } = useOkapiKyMutation({
    mutationKey: [KEY_UDPS, id],
    id,
    api: API_UDPS,
  });

  const { mutate: deleteUdp } = useDelete({
    onSuccess: () => {
      queryClient.removeQueries([KEY_UDPS, id]);
      refreshUdpList();
      history.push(`${urls.udps()}${location.search}`);
    },
    onError: (error) => {
      showErrorInfo(error, { callout, formatMessage });
    },
  });

  const {
    data: harvesterImplsData,
  } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_IMPL],
    api: API_HARVESTER_IMPL,
  });

  const {
    data: harvesterJobsData,
  } = useOkapiKyQuery({
    queryKey: [KEY_HARVESTER_JOBS, id],
    api: API_HARVESTER_JOBS,
    params: {
      query: `(providerId==${id} and startedAt="") sortby finishedAt/sort.descending`,
      limit: '1',
    },
  });

  const {
    data: settingsData,
  } = useOkapiKyQuery({
    queryKey: [KEY_SETTINGS, SCOPES.EUSAGE, CONFIG_NAMES.HIDE_CREDENTIALS],
    api: API_SETTINGS_ENTRIES,
    params: {
      query: `(scope==${SCOPES.EUSAGE} and key==${CONFIG_NAMES.HIDE_CREDENTIALS})`,
    },
  });

  const {
    data: counterReportsData,
    isLoading: isCounterReportsLoading,
  } = useOkapiKyQuery({
    queryKey: [KEY_COUNTER_REPORTS, id, statsReloadCount],
    api: `${API_COUNTER_REPORTS_SORTED}/${id}`,
    params: {
      limit: '1000',
    },
  });

  const {
    data: customReportsData,
    isLoading: isCustomReportsLoading,
  } = useOkapiKyQuery({
    queryKey: [KEY_CUSTOM_REPORTS, id, statsReloadCount],
    api: API_CUSTOM_REPORTS,
    params: {
      query: `(providerId=${id})`,
      limit: '1000',
    },
  });

  const {
    data: failedAttemptsSettingsData,
  } = useOkapiKyQuery({
    queryKey: [KEY_SETTINGS, SCOPES.HARVESTER, CONFIG_NAMES.MAX_FAILED_ATTEMPTS],
    api: API_SETTINGS_ENTRIES,
    params: {
      query: `(scope==${SCOPES.HARVESTER} and key==${CONFIG_NAMES.MAX_FAILED_ATTEMPTS})`,
    },
  });

  useEffect(() => {
    if (udpError) {
      showErrorInfo(udpError, { callout, formatMessage });
    }
  }, [udpError, callout, formatMessage]);

  const handleClose = () => {
    history.push(`${urls.udps()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.udpEdit(id)}${location.search}`);
  };

  const handleDelete = () => {
    deleteUdp();
  };

  const reloadUdp = () => {
    return queryClient.invalidateQueries([KEY_UDPS, id]);
  };

  const getLastHarvestingJob = () => {
    return get(harvesterJobsData, 'jobInfos[0]', {}) || get(harvesterJobsData, '[0]', {});
  };

  const getCounterReports = (udpId) => {
    const records = counterReportsData?.counterReportsPerYear
      ? [counterReportsData]
      : counterReportsData?.records || null;

    const reports = !isEmpty(records) ? records[0].counterReportsPerYear : [];

    if (
      !isEmpty(reports) &&
      reports[0].reportsPerType[0].counterReports[0].providerId === udpId
    ) {
      return reports;
    }

    return [];
  };

  const getCustomReports = (udpId) => {
    const reports = get(customReportsData, 'customReports', get(customReportsData, 'records[0].customReports', []));

    if (!isEmpty(reports) && reports[0].providerId === udpId) {
      return reports;
    }

    return [];
  };

  const isStatsLoading = isCounterReportsLoading || isCustomReportsLoading;

  const isHarvesterExistent = () => {
    return stripes.hasInterface('erm-usage-harvester');
  };

  const getMaxFailedAttempts = () => {
    const settings = failedAttemptsSettingsData?.items || [];

    if (isEmpty(settings) || settings.length === 0) {
      return MAX_FAILED_ATTEMPTS;
    }

    return settings[0].value;
  };

  const reloadStatistics = () => {
    queryClient.removeQueries([KEY_COUNTER_REPORTS, id]);
    queryClient.removeQueries([KEY_CUSTOM_REPORTS, id]);

    setStatsReloadCount((c) => c + 1);
  };

  const selectedRecord = udpData ?? {};
  const isLoading = isUdpLoading;
  const counterReports = getCounterReports(id);
  const customReports = getCustomReports(id);
  const settings = settingsData?.items || [];

  let harvesterImpls = [];

  if (Array.isArray(harvesterImplsData)) {
    harvesterImpls = harvesterImplsData;
  } else if (harvesterImplsData) {
    harvesterImpls = [harvesterImplsData];
  }

  const maxFailedAttempts = parseInt(getMaxFailedAttempts(), 10);

  return (
    <UDPView
      canEdit={stripes.hasPerm('ui-erm-usage.udp.edit')}
      data={{
        counterReports,
        customReports,
        harvesterImpls,
        maxFailedAttempts,
        settings,
        usageDataProvider: selectedRecord,
        lastJob: getLastHarvestingJob(),
      }}
      handlers={{
        ...handlers,
        onClose: handleClose,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onReloadStatistics: reloadStatistics,
        onReloadUdp: reloadUdp,
      }}
      isHarvesterExistent={isHarvesterExistent()}
      isLoading={isLoading}
      isStatsLoading={isStatsLoading}
      location={location}
      statsReloadCount={statsReloadCount}
      stripes={stripes}
      tagsEnabled={tagsEnabled}
    />
  );
}

UDPViewRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.shape().isRequired,
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string,
      url: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
};

const UDPViewRouteContainer = compose(
  withReportHandlers
)(UDPViewRoute);

UDPViewRouteContainer.defaultProps = {
  tagsScope: SCOPES.TAGS,
};

export default UDPViewRouteContainer;
