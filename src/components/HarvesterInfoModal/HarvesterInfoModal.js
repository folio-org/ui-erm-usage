import PropTypes from 'prop-types';
import { Button, Modal } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import urls from '../../util/urls';

const createSuccessText = (udpLabel) => {
  const additionalValues = udpLabel ? { provider: true, name: udpLabel } : { provider: false };
  return (
    <FormattedMessage
      id="ui-erm-usage.harvester.start.success"
      values={{
        link: (
          <Link to={urls.jobsView + '?sort=-startedAt'}>
            <FormattedMessage id="ui-erm-usage.harvester.jobs.paneTitle" />
          </Link>
        ),
        ...additionalValues,
      }}
    />
  );
};

const createErrorText = (udpLabel) => {
  const values = udpLabel ? { provider: true, name: udpLabel } : { provider: false };
  return <FormattedMessage id="ui-erm-usage.harvester.start.failure" values={values} />;
};

const createLabelText = (isSuccess) => {
  const msgId = isSuccess
    ? 'ui-erm-usage.harvester.start.started'
    : 'ui-erm-usage.harvester.start.failed';
  return <FormattedMessage id={msgId} />;
};

const HarvesterInfoModal = ({ errMessage = null, isSuccess = false, onClose, open = false, udpLabel }) => (
  <Modal
    dismissible
    closeOnBackgroundClick
    open={open}
    onClose={onClose}
    label={createLabelText(isSuccess)}
    footer={
      <Button onClick={onClose}>
        <FormattedMessage id="ui-erm-usage.general.ok" />
      </Button>
    }
  >
    {isSuccess ? (
      createSuccessText(udpLabel)
    ) : (
      <>
        {createErrorText(udpLabel)}
        <br />
        {errMessage}
      </>
    )}
  </Modal>
);

HarvesterInfoModal.propTypes = {
  errMessage: PropTypes.string,
  isSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  udpLabel: PropTypes.string,
};

export default HarvesterInfoModal;
