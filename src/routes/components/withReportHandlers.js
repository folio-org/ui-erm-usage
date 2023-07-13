import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStripes } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import { SubmissionError } from 'redux-form';
import saveAs from 'file-saver';
import { saveReport } from '../../util/downloadReport';
import getLegacyTokenHeader from '../../util/getLegacyTokenHeader';

export default function withReportHandlers(WrappedComponent) {
  function WithReportHandlers(props) {
    const calloutRef = useRef();

    const httpHeaders =
      {
        'X-Okapi-Tenant': props.stripes.okapi.tenant,
        ...getLegacyTokenHeader(props.stripes.okapi),
        credentials: 'include',
      };

    const okapiUrl = props.stripes.okapi.url;

    const downloadReportMultipleMonths = (
      udpId,
      reportType,
      version,
      start,
      end,
      format
    ) => {
      const calloutID = calloutRef.current.sendCallout({
        type: 'success',
        message: props.intl.formatMessage(
          { id: 'ui-erm-usage.statistics.counter.download.multiMonth.prepare' },
          { reportType, start, end, format }
        ),
        timeout: 0,
      });

      const errorMsg = props.intl.formatMessage(
        { id: 'ui-erm-usage.statistics.counter.download.multiMonth.error' },
        { reportType, start, end, format }
      );
      return fetch(
        `${okapiUrl}/counter-reports/export/provider/${udpId}/report/${reportType}/version/${version}/from/${start}/to/${end}?format=${format}`,
        { headers: httpHeaders }
      )
        .then((response) => {
          calloutRef.current.removeCallout(calloutID);
          if (response.status >= 400) {
            throw new SubmissionError({
              identifier: `Error ${response.status} retrieving report for multiple months`,
              _error: 'Fetch counter report failed',
            });
          } else {
            if (format === 'csv') {
              return response.text();
            }
            return response.blob();
          }
        })
        .then((text) => {
          saveReport(
            `${udpId}_${reportType}_${version}_${start}_${end}`,
            text,
            format
          );
        })
        .catch((err) => {
          calloutRef.current.sendCallout({
            type: 'error',
            message: errorMsg,
            timeout: 0,
          });
          throw new SubmissionError({
            identifier: `Error ${err} retrieving counter report for multiple months`,
            _error: 'Fetch counter report failed',
          });
        });
    };

    const downloadReportSingleMonth = (reportId, format) => {
      return fetch(
        `${okapiUrl}/counter-reports/export/${reportId}?format=${format}`,
        {
          headers: httpHeaders,
        }
      )
        .then((response) => {
          if (response.status >= 400) {
            throw new SubmissionError({
              identifier: `Error ${response.status} retrieving counter report by id`,
              _error: 'Fetch counter csv failed',
            });
          } else {
            if (format === 'csv') {
              return response.text();
            }
            return response.blob();
          }
        })
        .then((text) => {
          saveReport(reportId, text, format);
        })
        .catch((err) => {
          throw new Error(
            'Error while downloading CSV/xslx report. ' + err.message
          );
        });
    };

    const downloadReportSingleMonthRaw = (reportId, fileType) => {
      return fetch(`${okapiUrl}/counter-reports/${reportId}/download`, {
        headers: httpHeaders,
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new SubmissionError({
              identifier: `Error ${response.status} downloading counter report by id`,
              _error: 'Fetch counter csv failed',
            });
          } else {
            return response.text();
          }
        })
        .then((text) => {
          saveReport(reportId, text, fileType);
        })
        .catch((err) => {
          throw new Error(
            'Error while downloading xml/json report. ' + err.message
          );
        });
    };

    const downloadErmUsageFile = (fileId, fileName) => {
      return fetch(`${okapiUrl}/erm-usage/files/${fileId}`, {
        headers: httpHeaders,
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new SubmissionError({
              identifier: `Error ${response.status} retrieving file`,
              _error: 'Fetch file failed',
            });
          } else {
            return response.blob();
          }
        })
        .then(blob => {
          saveAs(blob, fileName);
        })
        .catch((err) => {
          throw new Error('Error while downloading file. ' + err.message);
        });
    };

    const { handlers, ...rest } = props;

    return (
      <>
        <WrappedComponent
          handlers={{
            ...handlers,
            onDownloadReportMultiMonth: downloadReportMultipleMonths,
            onDownloadReportSingleMonth: downloadReportSingleMonth,
            onDownloadReportSingleMonthRaw: downloadReportSingleMonthRaw,
            doDownloadFile: downloadErmUsageFile,
          }}
          {...rest}
        />
        <Callout ref={calloutRef} />
      </>
    );
  }
  WithReportHandlers.propTypes = {
    handlers: PropTypes.object,
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string,
      }).isRequired,
      store: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.object,
  };

  WithReportHandlers.defaultProps = {
    handlers: {},
  };

  return withStripes(injectIntl(WithReportHandlers));
}
