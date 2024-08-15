import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { formatDateTime, splitDateTime } from '../../util/dateTimeProcessing';

const PeriodicHarvestingView = ({
  periodicConfig,
  intl
}) => {
  const renderDetailView = (perConf) => {
    const { formatMessage, locale, timeZone } = intl;
    const lastTriggeredAt = formatDateTime(perConf.lastTriggeredAt, locale, timeZone);
    const { date, time } = splitDateTime(perConf.startAt, locale, timeZone);

    return (
      <>
        <div id="periodic-harvesting-detail-view">
          <Row>
            <Col xs={8}>
              <KeyValue
                label={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.date' })}
                value={date}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.time' })}
                value={time}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.periodicInterval' })}
                value={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.interval.' + perConf.periodicInterval })}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.lastTriggered' })}
                value={lastTriggeredAt}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  };

  const renderNotDefined = () => {
    return (
      <div id="periodic-harvesting-config-not-defined">
        <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.notDefined" />
      </div>
    );
  };

  if (isEmpty(periodicConfig)) {
    return renderNotDefined();
  } else {
    return renderDetailView(periodicConfig);
  }
};

PeriodicHarvestingView.propTypes = {
  periodicConfig: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(PeriodicHarvestingView);
