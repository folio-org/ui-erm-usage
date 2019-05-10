import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl';
import {
  Button,
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';
import {
  isYearMonth
} from '../../../util/Validate';
import {
  downloadCSVMultipleMonths
} from '../../../util/DownloadCSV';
import css from './DownloadRange.css';
import reportDownloadTypes from '../../../util/data/reportDownloadTypes';

class DownloadRange extends React.Component {
  static propTypes = {
    stripes: PropTypes
      .shape().isRequired,
    udpId: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);
    this.okapiUrl = props.stripes.okapi.url;
    this.httpHeaders = Object.assign({}, {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json',
    });

    this.state = {
      start: '',
      startError: null,
      end: '',
      endError: null,
      reportType: ''
    };
  }

  validate = (start, end) => {
    if (!isYearMonth(start)) {
      this.setState(
        {
          startError: this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm' }),
        }
      );
    }
    if (!isYearMonth(end)) {
      this.setState(
        {
          endError: this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm' }),
        }
      );
    }

    if (isYearMonth(start) && isYearMonth(end)) {
      if (start > end) {
        this.setState(
          {
            endError: this.props.intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.endGreaterStart' }),
            startError: null,
          }
        );
      } else {
        this.setState(
          {
            endError: null,
            startError: null,
          }
        );
      }
    }
  }

  hasError = () => {
    const result = (_.isEmpty(this.state.start) && _.isEmpty(this.state.end)) || (!_.isEmpty(this.state.startError) || !_.isEmpty(this.state.endError));
    return result;
  }

  handleStartChange = (e) => {
    const newStart = e.target.value;
    this.setState(
      {
        start: newStart,
        startError: null,
      }
    );
    this.validate(newStart, this.state.end);
  }

  handleEndChange = (e) => {
    const newEnd = e.target.value;
    this.setState(
      {
        end: newEnd,
        endError: null,
      }
    );
    this.validate(this.state.start, newEnd);
  }

  clearStart = () => {
    this.setState(
      {
        start: '',
        startError: null
      }
    );
  }

  clearEnd = () => {
    this.setState(
      {
        end: '',
        endError: null
      }
    );
  }

  doDownload = () => {
    if (!_.isEmpty(this.state.start) && !_.isEmpty(this.state.end)) {
      downloadCSVMultipleMonths(this.props.udpId, this.state.reportType, '4', this.state.start, this.state.end, this.okapiUrl, this.httpHeaders);
    }
  }

  onSelectReportType = (e) => {
    this.setState(
      {
        reportType: e.target.value
      }
    );
  }

  render() {
    const isDisabled = this.hasError();

    return (
      <Row>
        <Col xs={3}>
          <TextField
            label={<FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.start" />}
            placeholder="YYYY-MM"
            value={this.state.start}
            onChange={this.handleStartChange}
            onClearField={this.clearStart}
            error={this.state.startError}
          />
        </Col>
        <Col xs={3}>
          <TextField
            label={<FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.end" />}
            placeholder="YYYY-MM"
            value={this.state.end}
            onChange={this.handleEndChange}
            onClearField={this.clearEnd}
            error={this.state.endError}
          />
        </Col>
        <Col xs={3}>
          <Select
            label={<FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.reportType" />}
            dataOptions={reportDownloadTypes}
            onChange={this.onSelectReportType}
          />
        </Col>
        <Col xs={3}>
          <div className={css.startButton}>
            <Button
              onClick={this.doDownload}
              buttonStyle="primary"
              disabled={isDisabled}
            >
              <FormattedMessage id="ui-erm-usage.report.action.download.csv" />
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(DownloadRange);
