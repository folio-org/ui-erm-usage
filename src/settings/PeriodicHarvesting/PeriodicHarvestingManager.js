import { isEmpty } from 'lodash';
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  ConfirmationModal,
  IconButton,
  Pane,
  PaneHeader,
  PaneMenu,
} from '@folio/stripes/components';
import {
  CalloutContext,
  IfPermission,
} from '@folio/stripes/core';

import {
  combineDateTime,
  splitDateTime,
} from '../../util/dateTimeProcessing';
import usePeriodicConfig from '../../util/hooks/usePeriodicConfig';
import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import PeriodicHarvestingView from './PeriodicHarvestingView';

const PeriodicHarvestingManager = () => {
  const [config, setConfig] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { sendCallout } = useContext(CalloutContext);
  const { formatMessage, timeZone, locale } = useIntl();
  const periodicConfig = usePeriodicConfig();

  const showSuccessInfo = (intlTag) => {
    sendCallout({
      type: 'success',
      message: formatMessage({
        id: `ui-erm-usage.settings.harvester.config.periodic.${intlTag}`,
      }),
    });
  };

  const showErrorInfo = (error) => {
    const prefix = formatMessage({ id: 'ui-erm-usage.general.error2' });
    sendCallout({
      type: 'error',
      message: `${prefix}: ${error.message}`,
    });
  };

  const fetchPeriodicHarvestingConf = () => {
    periodicConfig.fetchConfig().then(setConfig)
      .catch(showErrorInfo);
  };

  const savePeriodicHarvestingConf = (formValues) => {
    const { date, time, periodicInterval } = formValues;

    const periodicConfigData = {
      startAt: combineDateTime(date, time, locale, timeZone),
      periodicInterval,
    };

    periodicConfig
      .saveConfig(periodicConfigData)
      .then(() => {
        setIsEditing(false);
        setConfig(periodicConfigData);
        showSuccessInfo('saved');
      })
      .catch(showErrorInfo);
  };

  const deletePeriodicHarvestingConf = () => {
    periodicConfig
      .deleteConfig()
      .then(() => {
        setIsEditing(false);
        setConfig({});
        showSuccessInfo('deleted');
      })
      .catch(showErrorInfo);
  };

  useEffect(() => {
    fetchPeriodicHarvestingConf();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getEditIcon = () => (isEmpty(config) ? 'plus-sign' : 'edit');

  const getLastMenu = () => {
    return (
      <IfPermission perm="ui-erm-usage.generalSettings.manage">
        <PaneMenu>
          {isEditing ? (
            <IconButton
              aria-label="End Edit Config"
              icon="times"
              id="clickable-close-edit-config"
              onClick={() => setConfirming(true)}
            />
          ) : (
            <IconButton
              aria-label="Start Edit Config"
              icon={getEditIcon()}
              id="clickable-open-edit-config"
              onClick={() => setIsEditing(true)}
            />
          )}
        </PaneMenu>
      </IfPermission>
    );
  };

  const renderPeriodicHarvestingPaneHeader = () => {
    return (
      <PaneHeader
        lastMenu={getLastMenu()}
        paneTitle={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.title' })}
      />
    );
  };

  const periodicHarvesting = isEditing ? (
    <PeriodicHarvestingForm
      initialValues={{ ...config, ...splitDateTime(config?.startAt, locale, timeZone) }}
      onDelete={deletePeriodicHarvestingConf}
      onSubmit={savePeriodicHarvestingConf}
    />
  ) : (
    <PeriodicHarvestingView periodicConfig={config} />
  );

  return (
    <>
      <Pane
        defaultWidth="fill"
        id="periodic-harvesting-pane"
        renderHeader={renderPeriodicHarvestingPaneHeader}
      >
        {periodicHarvesting}
      </Pane>
      <ConfirmationModal
        cancelLabel={formatMessage({ id: 'ui-erm-usage.general.closeWithoutSave' })}
        confirmLabel={formatMessage({ id: 'ui-erm-usage.general.keepEditing' })}
        heading={formatMessage({ id: 'ui-erm-usage.general.pleaseConfirm' })}
        message={formatMessage({
          id: 'ui-erm-usage.settings.harvester.config.periodic.edit.cancel',
        })}
        onCancel={() => {
          setIsEditing(false);
          setConfirming(false);
        }}
        onConfirm={() => setConfirming(false)}
        open={confirming}
      />
    </>
  );
};

export default PeriodicHarvestingManager;
