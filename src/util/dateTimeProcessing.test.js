import { combineDateTime, formatDateTime, splitDateTime } from './dateTimeProcessing';

describe('test split', () => {
  const splitCases = [
    ['de', 'Europe/Berlin', '2023-06-20T06:00:00+0000', '20.06.2023', '08:00'],
    ['de', 'Europe/Berlin', '2023-06-20T08:00:00+0200', '20.06.2023', '08:00'],
    ['en', 'America/New_York', '2023-06-20T06:00:00+0000', '06/20/2023', '2:00 AM'],
    ['en', 'America/New_York', '2023-06-20T02:00:00-0400', '06/20/2023', '2:00 AM'],
  ];

  test.each(splitCases)(
    '%s %s %s -> %s %s',
    (locale, timezone, dateTime, date, time) => {
      const split = splitDateTime(dateTime, locale, timezone);
      expect(split.date).toBe(date);
      expect(split.time).toBe(time);
    }
  );
});

describe('test combine', () => {
  const combineCases = [
    ['de', 'Europe/Berlin', '20.06.2023', '08:00', '2023-06-20T06:00:00+0000'],
    ['en', 'America/New_York', '06/20/2023', '2:00 AM', '2023-06-20T06:00:00+0000'],
  ];
  test.each(combineCases)(
    '%s %s %s %s -> %s',
    (locale, timezone, date, time, dateTime) => {
      const combined = combineDateTime(date, time, locale, timezone);
      expect(combined).toBe(dateTime);
    }
  );
});

describe('test format', () => {
  const combineCases = [
    ['de', 'Europe/Berlin', '2023-06-20T06:00:00+0000', '20. Juni 2023 08:00'],
    ['en', 'America/New_York', '2023-06-20T02:00:00-0400', 'June 20, 2023 2:00 AM'],
    ['en', 'America/New_York', undefined, '--'],
  ];
  test.each(combineCases)(
    '%s %s %s -> %s',
    (locale, timezone, dateTime, expected) => {
      const formatted = formatDateTime(dateTime, locale, timezone);
      expect(formatted).toBe(expected);
    }
  );
});
