import { useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStripes } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import saveAs from 'file-saver';
import { saveReport } from '../../util/downloadReport';
import fetchWithDefaultOptions from '../../util/fetchWithDefaultOptions';

export default function withReportHandlers(WrappedComponent) {
  function WithReportHandlers(props) {
    const calloutRef = useRef();
    const { okapi } = props.stripes;

    const downloadReportMultipleMonths = (udpId, reportType, version, start, end, format) => {
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
      return fetchWithDefaultOptions(
        okapi,
        `/counter-reports/export/provider/${udpId}/report/${reportType}/version/${version}/from/${start}/to/${end}?format=${format}`
      )
        .then((response) => {
          calloutRef.current.removeCallout(calloutID);
          if (response.status >= 400) {
            throw new Error(`Error ${response.status} retrieving report for multiple months: Fetch counter report failed`);
          } else {
            if (format === 'csv') {
              return response.text();
            }
            return response.blob();
          }
        })
        .then((text) => {
          saveReport(`${udpId}_${reportType}_${version}_${start}_${end}`, text, format);
        })
        .catch((err) => {
          calloutRef.current.sendCallout({
            type: 'error',
            message: errorMsg,
            timeout: 0,
          });
          throw new Error(`Error ${err} retrieving counter report for multiple months: Fetch counter report failed`);
        });
    };

    const downloadReportSingleMonth = (reportId, format) => {
      return fetchWithDefaultOptions(okapi, `/counter-reports/export/${reportId}?format=${format}`)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(`Error ${response.status} retrieving counter report by id: Fetch counter csv failed`);
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
          throw new Error('Error while downloading CSV/xslx report. ' + err.message);
        });
    };

    const downloadReportSingleMonthRaw = (reportId, fileType) => {
      return fetchWithDefaultOptions(okapi, `/counter-reports/${reportId}/download`)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(`Error ${response.status} downloading counter report by id: Fetch counter csv failed`);
          } else {
            return response.text();
          }
        })
        .then((text) => {
          saveReport(reportId, text, fileType);
        })
        .catch((err) => {
          throw new Error('Error while downloading xml/json report. ' + err.message);
        });
    };

    const downloadErmUsageFile = (fileId, fileName) => {
      return fetchWithDefaultOptions(okapi, `/erm-usage/files/${fileId}`)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(`Error ${response.status} retrieving file: Fetch file failed`);
          } else {
            return response.blob();
          }
        })
        .then((blob) => {
          saveAs(blob, fileName);
        })
        .catch((err) => {
          throw new Error('Error while downloading file. ' + err.message);
        });
    };

    const { handlers = {}, ...rest } = props;

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
        token: PropTypes.string,
        url: PropTypes.string,
      }).isRequired,
      store: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.object,
  };

  return withStripes(injectIntl(WithReportHandlers));
}
