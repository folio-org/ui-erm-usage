import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  CalloutContext,
  useOkapiKy,
} from '@folio/stripes/core';

import HarvesterInfoModal from '../../components/HarvesterInfoModal/HarvesterInfoModal';
import {
  combineDateTime,
  splitDateTime,
} from '../../util/dateTimeProcessing';
import usePeriodicConfig from '../../util/hooks/usePeriodicConfig';
import HarvestingForm from './HarvestingForm';

const Harvesting = () => {
  const ky = useOkapiKy();
  const { sendCallout } = useContext(CalloutContext);
  const { formatMessage, timeZone, locale } = useIntl();
  const periodicConfig = usePeriodicConfig();

  const [modalState, setModalState] = useState({ open: false });
  // config is undefined while fetching and an object afterwards ({} if none exists or the fetch fails)
  const [config, setConfig] = useState();
  // default start if no config exists; captured once so re-renders do not reinitialize the form
  const [now] = useState(() => new Date().toISOString());

  const showSuccessInfo = (intlTag) => {
    sendCallout({
      type: 'success',
      message: formatMessage({ id: `ui-erm-usage.settings.harvester.config.periodic.${intlTag}` }),
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
    periodicConfig.fetchConfig()
      .then(setConfig)
      .catch((error) => {
        // show the empty form
        setConfig({});
        showErrorInfo(error);
      });
  };

  const savePeriodicHarvestingConf = (formValues, form) => {
    const { date, time, periodicInterval } = formValues;

    const periodicConfigData = {
      startAt: combineDateTime(date, time, locale, timeZone),
      periodicInterval,
    };

    return periodicConfig
      .saveConfig(periodicConfigData)
      .then(() => {
        // the saved values become the new baseline
        form.reset(formValues);
        setConfig(periodicConfigData);
        showSuccessInfo('saved');
      })
      .catch(showErrorInfo);
  };

  useEffect(() => {
    fetchPeriodicHarvestingConf();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickStartHarvester = async () => {
    try {
      await ky('erm-usage-harvester/start', {
        method: 'GET',
        retry: 0,
      });
      setModalState({ open: true, isSuccess: true });
    } catch (error) {
      let errMessage = error.message;

      try {
        errMessage = (await error.response?.text?.()) ?? error.message;
      } catch {
        // keep error.message if the response body cannot be read
      }

      setModalState({ open: true, isSuccess: false, errMessage });
    }
  };

  const handleClose = () => {
    setModalState({ open: false });
  };

  return (
    <>
      <HarvestingForm
        initialValues={{
          enablePeriodic: false,
          ...config,
          ...splitDateTime(config?.startAt ?? now, locale, timeZone),
        }}
        isLoading={!config}
        onStartHarvester={onClickStartHarvester}
        onSubmit={savePeriodicHarvestingConf}
      />
      <HarvesterInfoModal {...modalState} onClose={handleClose} />
    </>
  );
};

export default Harvesting;
