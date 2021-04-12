import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Callout,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';
import { isYearMonth } from '../../../util/validate';
import exportFormats from '../../../util/data/exportFormats';
import css from './DownloadRange.css';

function DownloadRange(props) {
  const calloutRef = useRef();
  const [start, setStart] = useState('');
  const [startError, setStartError] = useState(null);
  const [end, setEnd] = useState('');
  const [endError, setEndError] = useState(null);
  const [reportType, setReportType] = useState('');
  const [exportFormat, setExportFormat] = useState(exportFormats[0].value);

  useEffect(() => {
    setReportType(_.get(props.downloadableReports, '[0]', ''));
  }, [props.downloadableReports]);

  const validate = (s, e) => {
    if (!isYearMonth(s)) {
      setStartError(
        props.intl.formatMessage({
          id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm',
        })
      );
    }
    if (!isYearMonth(e)) {
      setEndError(
        props.intl.formatMessage({
          id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm',
        })
      );
    }

    if (isYearMonth(s) && isYearMonth(e)) {
      if (s > e) {
        setEndError(
          props.intl.formatMessage({
            id:
              'ui-erm-usage.reportOverview.downloadMultiMonths.error.endGreaterStart',
          })
        );
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

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);
    setStartError(null);
    validate(newStart, end);
  };

  const handleEndChange = (e) => {
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

  const getCounterVersion = (rType) => {
    const { downloadableReports } = props;
    const index = downloadableReports.findIndex((r) => r.value === rType.value);
    if (index === -1) {
      return 0;
    }

    return downloadableReports[index].version;
  };

  const doDownload = () => {
    if (!_.isEmpty(start) && !_.isEmpty(end)) {
      props.handlers.onDownloadReportMultiMonth(
        props.udpId,
        reportType.value,
        getCounterVersion(reportType),
        start,
        end,
        exportFormat
      );
    }
  };

  const onSelectReportType = (e) => {
    setReportType(e.target);
  };

  const onSelectExportFormat = (e) => {
    setExportFormat(e.target.value);
  };

  const isDisabled = hasError();

  return (
    <>
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.start">
            {(startMessage) => (
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
        <Col xs={4}>
          <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.end">
            {(endMessage) => (
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
        <Col xs={4}>
          <></>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.reportType">
            {(label) => (
              <Select
                label={label}
                name="downloadMultiMonths.reportType"
                dataOptions={props.downloadableReports}
                onChange={onSelectReportType}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={4}>
          <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.dataType">
            {(label) => (
              <Select
                label={label}
                name="downloadMultiMonths.formats"
                dataOptions={exportFormats}
                onChange={onSelectExportFormat}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={4}>
          <div className={css.startButton}>
            <Button
              onClick={doDownload}
              buttonStyle="primary"
              disabled={isDisabled}
            >
              <FormattedMessage id="ui-erm-usage.report.action.download" />
            </Button>
          </div>
        </Col>
      </Row>
      <Callout ref={calloutRef} />
    </>
  );
}

DownloadRange.propTypes = {
  downloadableReports: PropTypes.arrayOf(PropTypes.object).isRequired,
  udpId: PropTypes.string.isRequired,
  intl: PropTypes.object,
  handlers: PropTypes.shape({
    onDownloadReportMultiMonth: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(injectIntl(DownloadRange));
