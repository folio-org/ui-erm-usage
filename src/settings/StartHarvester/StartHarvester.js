import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Pane, PaneHeader } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import HarvesterInfoModal from '../../components/HarvesterInfoModal/HarvesterInfoModal';

const StartHarvester = () => {
  const ky = useOkapiKy();
  const [modalState, setModalState] = useState({
    open: false,
  });

  const onClickStartHarvester = () => {
    ky('erm-usage-harvester/start', {
      method: 'GET',
      retry: 0,
    })
      .then(() => {
        setModalState({ open: true, isSuccess: true });
      })
      .catch((error) => {
        Promise.resolve(error.response?.text?.() ?? error.message)
          .catch(() => error.message)
          .then((errMessage) => setModalState({ open: true, isSuccess: false, errMessage }));
      });
  };

  const handleClose = () => {
    setModalState({ open: false });
  };

  const renderStartHarvestingPaneHeader = () => {
    return (
      <PaneHeader paneTitle={<FormattedMessage id="ui-erm-usage.harvester.start" />} />
    );
  };

  return (
    <Pane
      id="start-harvester-pane"
      defaultWidth="fill"
      fluidContentWidth
      renderHeader={renderStartHarvestingPaneHeader}
    >
      <div>
        <FormattedMessage id="ui-erm-usage.settings.harvester.start.tenant" />
        <Button id="start-harvester" onClick={() => onClickStartHarvester()}>
          <FormattedMessage id="ui-erm-usage.harvester.start" />
        </Button>
      </div>
      <HarvesterInfoModal {...modalState} onClose={handleClose} />
    </Pane>
  );
};

export default StartHarvester;
