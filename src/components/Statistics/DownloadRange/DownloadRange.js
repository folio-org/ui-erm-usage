import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Row,
  TextField
} from '@folio/stripes/components';
import {
  isYearMonth
} from '../../../util/Validate';
import {
  downloadCSVMultipleMonths
} from '../../../util/DownloadCSV';
import css from './DownloadRange.css';

class DownloadRange extends React.Component {
  static propTypes = {
    stripes: PropTypes
      .shape().isRequired,
    udpId: PropTypes.string.isRequired,
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
      start: null,
      startError: null,
      end: null,
      endError: null
    };
  }

  handleStartChange = (e) => {
    const newStart = e.target.value;
    if (_.isEmpty(newStart) || isYearMonth(newStart)) {
      if (!_.isEmpty(this.state.end)) {
        if (newStart > this.state.end) {
          this.setState(
            {
              startError: 'Must be smaller than end',
              start: null,
            }
          );
          return;
        }
      }
      this.setState(
        {
          start: newStart,
          startError: null,
        }
      );
    } else {
      this.setState(
        {
          startError: 'Must be YYYY-MM',
          start: null,
        }
      );
    }
  }

  handleEndChange = (e) => {
    const newEnd = e.target.value;
    if (_.isEmpty(newEnd) || isYearMonth(newEnd)) {
      if (!_.isEmpty(this.state.start)) {
        if (newEnd < this.state.start) {
          this.setState(
            {
              endError: 'Must be greater than start',
              end: null,
            }
          );
          return;
        }
      }
      this.setState(
        {
          end: newEnd,
          endError: null,
        }
      );
    } else {
      this.setState(
        {
          endError: 'Must be YYYY-MM',
          end: null,
        }
      );
    }
  }

  clearStart = () => {
    this.setState(
      {
        start: null,
        startError: null
      }
    );
  }

  clearEnd = () => {
    this.setState(
      {
        end: null,
        endError: null
      }
    );
  }

  doDownload = () => {
    if (!_.isEmpty(this.state.start) && !_.isEmpty(this.state.end)) {
      downloadCSVMultipleMonths(this.props.udpId, 'JR1', '4', this.state.start, this.state.end, this.okapiUrl, this.httpHeaders);
    }
  }

  render() {
    return (
      <Row>
        <Col xs={4}>
          <TextField
            label="Start"
            placeholder="YYYY-MM"
            value={this.state.start}
            onChange={this.handleStartChange}
            onClearField={this.clearStart}
            valid={_.isEmpty(this.state.startError)}
            error={this.state.startError}
          />
        </Col>
        <Col xs={4}>
          <TextField
            label="End"
            placeholder="YYYY-MM"
            value={this.state.end}
            onChange={this.handleEndChange}
            onClearField={this.clearEnd}
            valid={_.isEmpty(this.state.endError)}
            error={this.state.endError}
          />
        </Col>
        <Col xs={4}>
          <div className={css.startButton}>
            <Button
              onClick={this.doDownload}
            >
              { 'Download' }
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

export default DownloadRange;
