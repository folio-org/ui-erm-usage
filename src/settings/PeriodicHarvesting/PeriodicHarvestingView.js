import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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

class PeriodicHarvestingView extends React.Component {
  static propTypes = {
    periodicConfig: PropTypes.object,
    intl: PropTypes.object,
  };

  renderDetailView = periodicConfig => {
    const { formatMessage, locale, timeZone } = this.props.intl;
    const lastTriggeredAt = formatDateTime(periodicConfig.lastTriggeredAt, locale, timeZone);
    const { date, time } = splitDateTime(periodicConfig.startAt, locale, timeZone);

    return (
      <React.Fragment>
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
                value={formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.interval.' + periodicConfig.periodicInterval })}
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
      </React.Fragment>
    );
  }

  renderNotDefined = () => {
    return (
      <div id="periodic-harvesting-config-not-defined">
        <FormattedMessage
          id="ui-erm-usage.settings.harvester.config.periodic.notDefined"
        />
      </div>
    );
  }

  render() {
    const { periodicConfig } = this.props;
    if (_.isEmpty(periodicConfig)) {
      return this.renderNotDefined();
    } else {
      return this.renderDetailView(periodicConfig);
    }
  }
}

export default injectIntl(PeriodicHarvestingView);
