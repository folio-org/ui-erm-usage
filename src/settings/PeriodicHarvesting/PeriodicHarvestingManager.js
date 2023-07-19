import React, { useState, useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { CalloutContext, IfPermission } from '@folio/stripes/core';
import { ConfirmationModal, IconButton, Pane, PaneMenu } from '@folio/stripes/components';
import _ from 'lodash';
import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import PeriodicHarvestingView from './PeriodicHarvestingView';
import { combineDateTime, splitDateTime } from '../../util/dateTimeProcessing';
import usePeriodicConfig from '../../util/hooks/usePeriodicConfig';

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
    periodicConfig.fetchConfig().then(setConfig).catch(showErrorInfo);
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

  const getEditIcon = () => (_.isEmpty(config) ? 'plus-sign' : 'edit');

  const getLastMenu = () => {
    return (
      <IfPermission perm="ui-erm-usage.generalSettings.manage">
        <PaneMenu>
          {isEditing ? (
            <IconButton
              icon="times"
              id="clickable-close-edit-config"
              onClick={() => setConfirming(true)}
              aria-label="End Edit Config"
            />
          ) : (
            <IconButton
              icon={getEditIcon()}
              id="clickable-open-edit-config"
              onClick={() => setIsEditing(true)}
              aria-label="Start Edit Config"
            />
          )}
        </PaneMenu>
      </IfPermission>
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
        id="periodic-harvesting-pane"
        defaultWidth="fill"
        lastMenu={getLastMenu()}
        paneTitle={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.title' })}
      >
        {periodicHarvesting}
      </Pane>
      <ConfirmationModal
        open={confirming}
        heading={formatMessage({ id: 'ui-erm-usage.general.pleaseConfirm' })}
        message={formatMessage({
          id: 'ui-erm-usage.settings.harvester.config.periodic.edit.cancel',
        })}
        confirmLabel={formatMessage({ id: 'ui-erm-usage.general.keepEditing' })}
        onConfirm={() => setConfirming(false)}
        cancelLabel={formatMessage({ id: 'ui-erm-usage.general.closeWithoutSave' })}
        onCancel={() => {
          setIsEditing(false);
          setConfirming(false);
        }}
      />
    </>
  );
};

export default PeriodicHarvestingManager;
