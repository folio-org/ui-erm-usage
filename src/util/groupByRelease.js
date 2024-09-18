const groupByRelease = (counterReportsPerYear) => {
  return counterReportsPerYear.map(({ year, reportsPerType }) => {
    const stats = reportsPerType.flatMap(({ reportType, counterReports }) => {
      const reportsByRelease = counterReports.reduce((releaseAcc, report) => {
        const { release, yearMonth } = report;
        const month = yearMonth.substring(5, 7);

        if (!releaseAcc[release]) {
          releaseAcc[release] = {};
        }
        releaseAcc[release][month] = report;

        return releaseAcc;
      }, {});

      return Object.entries(reportsByRelease).map(([release, months]) => {
        return {
          report: reportType,
          release,
          ...months,
        };
      });
    });

    return { year, stats };
  });
};

export default groupByRelease;
