import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Col,
  Row,
} from '@folio/stripes/components';

import css from './CounterStatistics.css';
import DownloadRange from './DownloadRange';
import StatisticsPerYear from './StatisticsPerYear';
import {
  getAvailableReports,
  getDownloadCounterReportTypes,
} from './utils';

const CounterStatistics = ({
  handlers,
  infoText = <FormattedMessage id="ui-erm-usage.reportOverview.infoText" />,
  providerId,
  reportFormatter,
  reports,
  showMultiMonthDownload,
}) => {
  const calcDownloadableReportTypes = () => {
    const availableReports = getAvailableReports(reports);
    const reportNamesNew = availableReports?.map((cr) => getDownloadCounterReportTypes(cr.release, cr.report)).flat();

    return sortBy(reportNamesNew, ['release', 'label']);
  };

  const [downloadableReports, setDownloadableReports] = useState(calcDownloadableReportTypes());

  useEffect(() => {
    setDownloadableReports(calcDownloadableReportTypes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  return (
    <>
      <Row className={css.subAccordionSections}>
        <Col xs={12}>
          <hr />
          <div className={css.sub2Headings}>
            <FormattedMessage id="ui-erm-usage.reportOverview.reportsPerYear" />
          </div>
        </Col>
        <Col xs={12}>
          <AccordionSet id="data-test-counter-reports">
            <StatisticsPerYear
              infoText={infoText}
              reportFormatter={reportFormatter}
              reports={reports}
            />
          </AccordionSet>
        </Col>
      </Row>
      {showMultiMonthDownload && (
        <Row className={css.subAccordionSections}>
          <Col xs={12}>
            <hr />
            <div className={css.sub2Headings}>
              <FormattedMessage id="ui-erm-usage.reportOverview.downloadMultiMonths" />
            </div>
          </Col>
          <Col xs={12}>
            <DownloadRange
              downloadableReports={downloadableReports}
              onDownloadReportMultiMonth={handlers.onDownloadReportMultiMonth}
              udpId={providerId}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

CounterStatistics.propTypes = {
  handlers: PropTypes.shape({
    onDownloadReportMultiMonth: PropTypes.func,
  }).isRequired,
  infoText: PropTypes.node,
  providerId: PropTypes.string.isRequired,
  reportFormatter: PropTypes.shape({}).isRequired,
  reports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  showMultiMonthDownload: PropTypes.bool,
};

export default CounterStatistics;
