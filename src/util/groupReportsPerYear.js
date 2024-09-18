const renderReportPerYear = (reports) => {
  const o = Object.create({});
  let maxMonth = 0;
  reports.forEach((r) => {
    o.report = r.reportName;
    const month = r.yearMonth.substring(5, 7);
    if (parseInt(month, 10) >= maxMonth) {
      maxMonth = parseInt(month, 10);
    }
    o[month] = r;
  });
  while (maxMonth < 12) {
    const newMonth = maxMonth + 1;
    const monthPadded = newMonth.toString().padStart(2, '0');
    o[monthPadded] = null;
    maxMonth = newMonth;
  }
  return o;
};

const groupReportByRelease = (data) => {
  const transformed = [];

  data.forEach((item) => {
    const releases = {};

    Object.keys(item).forEach((key) => {
      if (key === 'report') return;

      const reportItem = item[key];

      if (!reportItem) return;

      const release = reportItem.release;

      if (!releases[release]) {
        releases[release] = {
          report: item.report,
          release,
        };
      }

      releases[release][key] = reportItem;
    });

    Object.values(releases).forEach((releaseGroup) => {
      transformed.push(releaseGroup);
    });
  });

  return transformed;
};

const groupPerYear = (stats) => {
  return stats.map((statsPerYear) => {
    const y = statsPerYear.year;
    const year = y.toString();
    const renderedStats = statsPerYear.reportsPerType.map((reportsTyped) => {
      return renderReportPerYear(reportsTyped.counterReports);
    });

    const groupByRelease = groupReportByRelease(renderedStats);
    return {
      year,
      stats: groupByRelease,
    };
  });
};

export default groupPerYear;
