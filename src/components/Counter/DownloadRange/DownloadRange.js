import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useState, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Callout,
  Col,
  Row,
  Select,
} from '@folio/stripes/components';

import exportFormats from '../../../util/data/exportFormats';
import Monthpicker from '../../../util/Monthpicker';
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
  const [isStartValid, setIsStartValid] = useState(true);
  const [isEndValid, setIsEndValid] = useState(true);

  const validate = (values) => {
    const errors = {};

    if (values.startDate && values.endDate && values.startDate > values.endDate) {
      errors.endDate = intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.error.endGreaterStart' });
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
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        pristine,
        values,
      }) => {
        const isDisabled =
          !values.startDate ||
          !values.endDate ||
          !isStartValid ||
          !isEndValid ||
          values.startDate > values.endDate;

        return (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={4}>
                <Field
                  backendDateFormat="YYYY-MM"
                  component={Monthpicker}
                  isRequired
                  name="startDate"
                  textLabel={intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.start' })}
                  onValidityChange={setIsStartValid}
                />
              </Col>
              <Col xs={4}>
                <Field
                  backendDateFormat="YYYY-MM"
                  component={Monthpicker}
                  isRequired
                  name="endDate"
                  textLabel={intl.formatMessage({ id: 'ui-erm-usage.reportOverview.downloadMultiMonths.end' })}
                  onValidityChange={setIsEndValid}
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
                      label={label}
                      name="downloadMultiMonths.reportType"
                      dataOptions={downloadableReports}
                      onChange={onSelectReportType}
                      value={selectedReport.value}
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
                      value={exportFormat}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={4}>
                <div className={css.startButton}>
                  <Button
                    type="submit"
                    buttonStyle="primary"
                    disabled={isDisabled || submitting || pristine}
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
