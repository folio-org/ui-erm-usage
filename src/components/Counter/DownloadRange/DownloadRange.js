import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useState, useRef } from 'react';
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

function DownloadRange({
  downloadableReports,
  intl,
  onDownloadReportMultiMonth,
  udpId,
}) {
  const calloutRef = useRef();
  const [start, setStart] = useState('');
  const [startError, setStartError] = useState(null);
  const [end, setEnd] = useState('');
  const [endError, setEndError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(downloadableReports[0] || {});
  const [exportFormat, setExportFormat] = useState(exportFormats[0].value);

  const validate = (s, e) => {
    if (!isYearMonth(s)) {
      setStartError(
        intl.formatMessage({
          id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm',
        })
      );
    }
    if (!isYearMonth(e)) {
      setEndError(
        intl.formatMessage({
          id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.yyyymm',
        })
      );
    }

    if (isYearMonth(s) && isYearMonth(e)) {
      if (s > e) {
        setEndError(
          intl.formatMessage({
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
      (isEmpty(start) && isEmpty(end)) ||
      !isEmpty(startError) ||
      !isEmpty(endError);
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

  const doDownload = () => {
    if (!isEmpty(start) && !isEmpty(end)) {
      onDownloadReportMultiMonth(
        udpId,
        selectedReport.value,
        selectedReport.release,
        start,
        end,
        exportFormat
      );
    }
  };

  const onSelectReportType = (e) => {
    setSelectedReport(downloadableReports[e.target.selectedIndex]);
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
                aria-label="Startdate for downloading multi month report. Format YYYY-MM."
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
                aria-label="Enddate for downloading multi month report. Format YYYY-MM."
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
                dataOptions={downloadableReports}
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
  intl: PropTypes.object,
  onDownloadReportMultiMonth: PropTypes.func,
  udpId: PropTypes.string.isRequired,
};

export default stripesConnect(injectIntl(DownloadRange));
