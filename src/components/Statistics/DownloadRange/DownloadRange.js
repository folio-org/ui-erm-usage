import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';
import { isYearMonth } from '../../../util/validate';
import { downloadCSVMultipleMonths } from '../../../util/downloadCSV';
import css from './DownloadRange.css';

function DownloadRange(props) {
  const okapiUrl = props.stripes.okapi.url;
  const httpHeaders = Object.assign(
    {},
    {
      'X-Okapi-Tenant': props.stripes.okapi.tenant,
      'X-Okapi-Token': props.stripes.store.getState().okapi.token,
      'Content-Type': 'application/json'
    }
  );

  const [start, setStart] = useState('');
  const [startError, setStartError] = useState(null);
  const [end, setEnd] = useState('');
  const [endError, setEndError] = useState(null);
  const [reportType, setReportType] = useState('');

  useEffect(() => {
    setReportType(_.get(props.downloadableReports, '[0]', ''));
  }, [props.downloadableReports]);

  const validate = (s, e) => {
    if (!isYearMonth(s)) {
      setStartError(props.intl.formatMessage({
        id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm'
      }));
    }
    if (!isYearMonth(e)) {
      setEndError(props.intl.formatMessage({
        id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm'
      }));
    }

    if (isYearMonth(s) && isYearMonth(e)) {
      if (s > e) {
        setEndError(props.intl.formatMessage({
          id:
            'ui-erm-usage.reportOverview.downloadMultiMonths.error.endGreaterStart'
        }));
        setStartError(null);
      } else {
        setEndError(null);
        setStartError(null);
      }
    }
  };

  const hasError = () => {
    const result =
      (_.isEmpty(start) && _.isEmpty(end)) ||
      !_.isEmpty(startError) ||
      !_.isEmpty(endError);
    return result;
  };

  const handleStartChange = e => {
    const newStart = e.target.value;
    setStart(newStart);
    setStartError(null);
    validate(newStart, end);
  };

  const handleEndChange = e => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    setEndError(null);
    validate(start, newEnd);
  };

  const clearStart = () => {
    setStart('');
    setStartError(null);
  };

  const clearEnd = () => {
    setEnd('');
    setEndError(null);
  };

  const getCounterVersion = rType => {
    const { downloadableReports } = props;
    const index = downloadableReports.findIndex(r => r.value === rType.value);
    if (index === -1) {
      return 0;
    }

    return downloadableReports[index].version;
  };

  const doDownload = () => {
    if (!_.isEmpty(start) && !_.isEmpty(end)) {
      downloadCSVMultipleMonths(
        props.udpId,
        reportType.value,
        getCounterVersion(reportType),
        start,
        end,
        okapiUrl,
        httpHeaders
      );
    }
  };

  const onSelectReportType = e => {
    setReportType(e.target);
  };

  const isDisabled = hasError();

  return (
    <Row>
      <Col xs={3}>
        <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.start">
          {startMessage => (
            <TextField
              ariaLabel="Startdate for downloading multi month report. Format YYYY-MM."
              label={startMessage}
              name="downloadMultiMonths.startDate"
              placeholder="YYYY-MM"
              value={start}
              onChange={handleStartChange}
              onClearField={clearStart}
              error={startError}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col xs={3}>
        <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.end">
          {endMessage => (
            <TextField
              ariaLabel="Enddate for downloading multi month report. Format YYYY-MM."
              label={endMessage}
              name="downloadMultiMonths.endDate"
              placeholder="YYYY-MM"
              value={end}
              onChange={handleEndChange}
              onClearField={clearEnd}
              error={endError}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col xs={3}>
        <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.reportType">
          {label => (
            <Select
              label={label}
              name="downloadMultiMonths.reportType"
              dataOptions={props.downloadableReports}
              onChange={onSelectReportType}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col xs={3}>
        <div className={css.startButton}>
          <Button
            onClick={doDownload}
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

DownloadRange.propTypes = {
  downloadableReports: PropTypes.arrayOf(PropTypes.object).isRequired,
  stripes: PropTypes.shape().isRequired,
  udpId: PropTypes.string.isRequired,
  intl: intlShape.isRequired
};

export default stripesConnect(injectIntl(DownloadRange));
