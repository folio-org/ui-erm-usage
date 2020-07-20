import faker from 'faker';
import Factory from './application';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default Factory.extend({
  id: () => faker.random.uuid(),
  downloadTime: () => faker.date.past(),
  release: () => 4,
  reportName: (i) => {
    if (i % 4 === 0) {
      return 'JR1';
    } else {
      return 'BR1';
    }
  },
  yearMonth: (i) => {
    let month = i;
    month = month === 0 ? 1 : month;
    month = month < 10 ? '0' + month : month;
    let year = getRandomInt(19);
    year = 18;
    return '20' + year + '-' + month;
  },
  customerId: (i) => 'customerId_' + i,

  failedAttempts: (i) => {
    if (i % 2 === 0) {
      return i;
    } else {
      return null;
    }
  },

  failedReason: (i) => {
    if (i % 2 === 0) {
      return 'failed';
    } else {
      return null;
    }
  },

  report: (i) => {
    if (i % 2 !== 0) {
      return '...';
    } else {
      return null;
    }
  },

  afterCreate(report, _) {
    if (report.provider) {
      report.update({
        provider: report.provider,
      });
    }
  }
});
