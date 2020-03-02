import _ from 'lodash';

export default function sortByYearAndType(reports) {
  const counterReports = reports.models;
  const groupedPerYear = _.groupBy(counterReports, cr => {
    return cr.attrs.yearMonth.substring(0, 4);
  });

  // _.property('attrs.yearMonth.substring(0, 4)'));

  const result = Object.create({});
  _.keys(groupedPerYear).forEach(year => {
    const byYear = groupedPerYear[year];
    const statsByReport = _.groupBy(byYear, 'reportName');
    result[year] = statsByReport;
  });
  return result;
}
