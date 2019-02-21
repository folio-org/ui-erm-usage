import _ from 'lodash';

function groupByYearAndReport(stats) {
  stats.forEach(e => {
    e.year = e.yearMonth.substring(0, 4);
    e.month = e.yearMonth.substring(5, 7);
  });

  const statsByYear = _.groupBy(stats, 'year');

  const result = Object.create({});
  _.keys(statsByYear).forEach(year => {
    const byYear = statsByYear[year];
    const statsByReport = _.groupBy(byYear, 'reportName');
    result[year] = statsByReport;
  });
  return result;
}

export default groupByYearAndReport;
