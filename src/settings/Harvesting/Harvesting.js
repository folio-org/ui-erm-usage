import { FORM_ERROR } from 'final-form';
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
import { API_HARVESTER_START } from '../../util/constants';
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
  const {
    config,
    fetchError,
    saveConfig,
    deleteConfig,
  } = usePeriodicConfig();

  const [modalState, setModalState] = useState({ open: false });

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

  // enablePeriodic is checked if a schedule exists, without a schedule all fields stay empty
  const getInitialValues = (cfg) => ({
    ...cfg,
    enablePeriodic: Boolean(cfg?.startAt),
    ...(cfg?.startAt && splitDateTime(cfg.startAt, locale, timeZone)),
  });

  const handleSubmitError = (error) => {
    showErrorInfo(error);
    return { [FORM_ERROR]: error.message };
  };

  const deletePeriodicHarvestingConf = (form) => {
    // nothing to delete, just discard the changes
    if (!config?.startAt) {
      form.reset();
      return undefined;
    }

    return deleteConfig()
      .then(() => {
        form.reset(getInitialValues({}));
        showSuccessInfo('deleted');
      })
      .catch(handleSubmitError);
  };

  const savePeriodicHarvestingConf = (formValues, form) => {
    if (!formValues.enablePeriodic) {
      return deletePeriodicHarvestingConf(form);
    }

    const { date, time, periodicInterval } = formValues;

    const periodicConfigData = {
      startAt: combineDateTime(date, time, locale, timeZone),
      periodicInterval,
    };

    return saveConfig(periodicConfigData)
      .then(() => {
        // the saved values become the new baseline; reset also clears submitSucceeded,
        // which would otherwise prevent the unsaved-changes prompt
        form.reset(formValues);
        showSuccessInfo('saved');
      })
      .catch(handleSubmitError);
  };

  useEffect(() => {
    // the form is shown empty in this case
    if (fetchError) showErrorInfo(fetchError);
  }, [fetchError]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickStartHarvester = async () => {
    try {
      await ky(API_HARVESTER_START, {
        method: 'GET',
        retry: 0,
      });
      setModalState({ open: true, isSuccess: true });
    } catch (error) {
      let errMessage = error.message;

      try {
        errMessage = (await error.response?.text?.()) || error.message;
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
        initialValues={getInitialValues(config)}
        isLoading={!config}
        onStartHarvester={onClickStartHarvester}
        onSubmit={savePeriodicHarvestingConf}
      />
      <HarvesterInfoModal {...modalState} onClose={handleClose} />
    </>
  );
};

export default Harvesting;
