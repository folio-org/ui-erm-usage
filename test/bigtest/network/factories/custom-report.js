import faker from 'faker';
import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  year: () => 2019,
  fileId: () => faker.random.uuid(),
  fileName: () => 'filename.txt',
  fileSize: () => 1024,
  note: (i) => `custom-report-${i}`,

  afterCreate(report, _) {
    if (report.provider) {
      report.update({
        provider: report.provider,
      });
    }
  },
});
