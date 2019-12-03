import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class PeriodicHarvestingView extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape(),
    intl: intlShape.isRequired,
    timeFormat: PropTypes.string,
    timeZone: PropTypes.string.isRequired
  };

  renderDetailView = values => {
    const { timeFormat, timeZone } = this.props;
    const time = moment.tz(values.startAt, timeZone).format(timeFormat);

    const lastTriggeredAt = values.lastTriggeredAt ? moment(values.lastTriggeredAt).format('LLL') : '--';
    return (
      <React.Fragment>
        <div id="periodic-harvesting-detail-view">
          <Row>
            <Col xs={8}>
              <KeyValue
                label={this.props.intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.date' })}
                value={values.startDate}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={this.props.intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.time' })}
                value={time}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={this.props.intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.periodicInterval' })}
                value={values.periodicInterval}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={this.props.intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.lastTriggered' })}
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
    const { initialValues } = this.props;
    if (initialValues.periodicInterval) {
      return this.renderDetailView(initialValues);
    } else {
      return this.renderNotDefined();
    }
  }
}

export default injectIntl(PeriodicHarvestingView);
