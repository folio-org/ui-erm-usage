import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { AccordionSet, Col, Row } from '@folio/stripes/components';

import StatisticsPerYear from './StatisticsPerYear';
import DownloadRange from './DownloadRange';
import reportDownloadTypes from '../../util/data/reportDownloadTypes';
import css from './CounterStatistics.css';

const CounterStatistics = ({
  handlers,
  infoText = <FormattedMessage id="ui-erm-usage.reportOverview.infoText" />,
  providerId,
  reportFormatter,
  reports,
  showMultiMonthDownload,
  stripes,
}) => {
  const calcDownloadableReportTypes = () => {
    const reportNamesNew = reports
      .flatMap((c) => c.stats)
      .filter((cr) => !cr.failedAttempts || cr.failedAttempts === 0)
      .map((cr) => (cr.release === '5' ? `${cr.report} (${cr.release})` : cr.report));
    const available = new Set(reportNamesNew);
    const intersection = new Set(
      reportDownloadTypes.filter((y) => available.has(y.label.split('_')[0]))
    );
    return sortBy([...intersection], ['label']);
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
              reports={reports}
              reportFormatter={reportFormatter}
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
              stripes={stripes}
              udpId={providerId}
              downloadableReports={downloadableReports}
              handlers={handlers}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

CounterStatistics.propTypes = {
  handlers: PropTypes.shape({}),
  infoText: PropTypes.node,
  providerId: PropTypes.string.isRequired,
  reportFormatter: PropTypes.shape({}).isRequired,
  reports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  showMultiMonthDownload: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
    okapi: PropTypes.shape({
      url: PropTypes.string.isRequired,
      tenant: PropTypes.string.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  }).isRequired,
};

export default CounterStatistics;
