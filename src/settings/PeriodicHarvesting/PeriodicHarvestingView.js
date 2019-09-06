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
    timeFormat: PropTypes.shape(),
  };

  renderDetailView = values => {
    const { timeFormat } = this.props;
    const time = moment(values.startTime).format(timeFormat);
    const lastTriggeredAt = values.lastTriggeredAt ? moment(values.lastTriggeredAt).format('LLL') : '--';
    return (
      <React.Fragment>
        <Row>
          <Col xs={8}>
            <KeyValue
              label={this.props.intl.formatMessage({ id: 'ui-erm-usage.settings.harvester.config.periodic.start.time' })}
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
      </React.Fragment>
    );
  }

  renderNotDefined = () => {
    return (
      <FormattedMessage id="ui-erm-usage.settings.harvester.config.periodic.notDefined" />
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
