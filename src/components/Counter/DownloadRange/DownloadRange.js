import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import {
  useRef,
  useState,
} from 'react';
import { Form } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { Monthpicker } from '@folio/stripes-leipzig-components';
import {
  Button,
  Callout,
  Col,
  Row,
  Select,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import exportFormats from '../../../util/data/exportFormats';
import css from './DownloadRange.css';

const DownloadRange = ({
  downloadableReports,
  intl,
  onDownloadReportMultiMonth,
  udpId,
}) => {
  const calloutRef = useRef();
  const [selectedReport, setSelectedReport] = useState(downloadableReports[0] || {});
  const [exportFormat, setExportFormat] = useState(exportFormats[0].value);

  const validate = (values) => {
    if (!values.startDate && !values.endDate) {
      return undefined;
    }

    const errors = {};

    if (new Date(values.startDate) > new Date(values.endDate)) {
      errors.endDate =
        intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.endGreaterStart' });
    }

    return errors;
  };

  const onSubmit = (values) => {
    if (selectedReport?.value && !isEmpty(values.startDate) && !isEmpty(values.endDate)) {
      onDownloadReportMultiMonth(
        udpId,
        selectedReport.value,
        selectedReport.release,
        values.startDate,
        values.endDate,
        exportFormat
      );
    } else {
      calloutRef?.current?.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.missingFields' }),
      });
    }
  };

  const onSelectReportType = (e) => {
    setSelectedReport(downloadableReports[e.target.selectedIndex]);
  };

  const onSelectExportFormat = (e) => {
    setExportFormat(e.target.value);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        invalid,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={4}>
                <Monthpicker
                  backendDateFormat="YYYY-MM"
                  isRequired
                  name="startDate"
                  textLabel={intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.start' })}
                />
              </Col>
              <Col xs={4}>
                <Monthpicker
                  backendDateFormat="YYYY-MM"
                  isRequired
                  name="endDate"
                  textLabel={intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.end' })}
                />
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
                      dataOptions={downloadableReports}
                      label={label}
                      name="downloadMultiMonths.reportType"
                      onChange={onSelectReportType}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={4}>
                <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths.dataType">
                  {(label) => (
                    <Select
                      dataOptions={exportFormats}
                      label={label}
                      name="downloadMultiMonths.formats"
                      onChange={onSelectExportFormat}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={4}>
                <div className={css.startButton}>
                  <Button
                    buttonStyle="primary"
                    disabled={invalid}
                    type="submit"
                  >
                    <FormattedMessage id="ui-erm-usage.report.action.download" />
                  </Button>
                </div>
              </Col>
            </Row>
            <Callout ref={calloutRef} />
          </form>
        );
      }}
      validate={validate}
    />
  );
};

DownloadRange.propTypes = {
  downloadableReports: PropTypes.arrayOf(PropTypes.object).isRequired,
  intl: PropTypes.object,
  onDownloadReportMultiMonth: PropTypes.func,
  udpId: PropTypes.string.isRequired,
};

export default stripesConnect(injectIntl(DownloadRange));
