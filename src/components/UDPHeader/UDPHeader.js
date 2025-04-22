import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import statusOptions from '../../util/data/statusOptions';
import css from './UDPHeader.css';

const UDPHeader = ({ usageDataProvider = { harvestingConfig: {} }, lastJob = {} }) => {
  const stripes = useStripes();
  const {
    latestReport,
    harvestingConfig: { harvestingStatus },
    status,
  } = usageDataProvider;
  const { finishedAt } = lastJob;
  const harvestingStatusOption = statusOptions.find(
    (e) => e.value === harvestingStatus
  );
  const providerStatusOption = statusOptions.find(
    (e) => e.value === status
  );
  const finishedAtLabel =
    finishedAt &&
    new Date(finishedAt).toLocaleString(stripes.locale, {
      timeZone: stripes.timezone,
    });

  return (
    <div>
      <Row className={css.udpHeader}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-erm-usage.information.providerStatus" />}
            value={
              status ? <FormattedMessage id={providerStatusOption.label} /> : <NoValue />
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={
              <FormattedMessage id="ui-erm-usage.information.latestStatistics" />
            }
            value={latestReport ?? <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={
              <FormattedMessage id="ui-erm-usage.information.harvestingStatus" />
            }
            value={
              harvestingStatusOption ? (
                <FormattedMessage id={harvestingStatusOption.label} />
              ) : (
                <NoValue />
              )
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={
              <FormattedMessage id="ui-erm-usage.information.lastJobFinishedAt" />
            }
            value={finishedAtLabel ?? <NoValue />}
          />
        </Col>
      </Row>
    </div>
  );
};

UDPHeader.propTypes = {
  usageDataProvider: PropTypes.shape({
    latestReport: PropTypes.string,
    harvestingConfig: PropTypes.shape({
      harvestingStatus: PropTypes.string,
    }),
    status: PropTypes.string,
  }),
  lastJob: PropTypes.shape({
    finishedAt: PropTypes.string,
  }),
};

export default UDPHeader;
