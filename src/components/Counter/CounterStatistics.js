import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { AccordionSet, Col, Row } from '@folio/stripes/components';

import StatisticsPerYear from './StatisticsPerYear';
import DownloadRange from './DownloadRange';
import { rawDownloadCounterReportTypeMapping } from '../../util/data/downloadReportTypesOptions';
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
  const getSubReports = (release, report) => {
    const subReports = rawDownloadCounterReportTypeMapping[Math.trunc(release)][report];

    const subReportLabels = subReports.map((subReport) => ({
      value: subReport,
      label: `${subReport} (${release})`,
    }));

    return subReportLabels;
  };

  const calcDownloadableReportTypes = () => {
    const reportNamesNew = reports
      .flatMap((c) => c.stats)
      .filter((cr) => {
        return Object.values(cr).every((monthData) => {
          // skip 'report' and 'release'
          if (monthData && typeof monthData === 'string') {
            return true;
          }
          return monthData && (!monthData.failedAttempts || monthData.failedAttempts === 0);
        });
      })
      .map((cr) => getSubReports(cr.release, cr.report)).flat();

    if (reportNamesNew.length === 0) {
      return null;
    } else {
      const deduplicatedReportNames = reportNamesNew.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.label === item.label)
      );
      return sortBy(deduplicatedReportNames, ['label']);
    }
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
