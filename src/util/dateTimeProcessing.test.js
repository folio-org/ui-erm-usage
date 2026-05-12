import { loadDayJSLocale } from '@folio/stripes/components';

import {
  combineDateTime,
  formatDateTime,
  splitDateTime,
} from './dateTimeProcessing';

describe('splitDateTime', () => {
  const cases = [
    ['de', 'Europe/Berlin', '2023-06-20T06:00:00+0000', '20.06.2023', '08:00'],
    ['de', 'Europe/Berlin', '2023-06-20T08:00:00+0200', '20.06.2023', '08:00'],
    ['en', 'America/New_York', '2023-06-20T06:00:00+0000', '06/20/2023', '2:00 AM'],
    ['en', 'America/New_York', '2023-06-20T02:00:00-0400', '06/20/2023', '2:00 AM'],
    ['en-SE', 'Europe/Stockholm', '2026-04-30T06:15:00+0000', '2026-04-30', '08:15'],
  ];

  test.each(cases)(
    '%s %s %s -> %s %s',
    (locale, timezone, dateTime, date, time) => {
      const split = splitDateTime(dateTime, locale, timezone);
      expect(split.date).toBe(date);
      expect(split.time).toBe(time);
    }
  );

  it('returns blank fields for an invalid input', () => {
    expect(splitDateTime('not-a-date', 'en-SE', 'Europe/Stockholm')).toEqual({
      date: '',
      time: '',
    });
  });
});

describe('combineDateTime', () => {
  const cases = [
    ['de', 'Europe/Berlin', '20.06.2023', '08:00', '2023-06-20T06:00:00+0000'],
    ['en', 'America/New_York', '06/20/2023', '2:00 AM', '2023-06-20T06:00:00+0000'],
    ['en-SE', 'Europe/Stockholm', '2026-04-30', '08:15', '2026-04-30T06:15:00+0000'],
  ];

  test.each(cases)(
    '%s %s %s %s -> %s',
    (locale, timezone, date, time, expected) => {
      expect(combineDateTime(date, time, locale, timezone)).toBe(expected);
    }
  );

  const invalidCases = [
    ['unparseable date', 'Invalid date', '08:00'],
    ['unparseable time', '2026-04-30', 'Invalid date'],
    ['impossible calendar date', '2026-02-31', '08:15'],
  ];

  it.each(invalidCases)('returns null for %s', (_, date, time) => {
    expect(combineDateTime(date, time, 'en-SE', 'Europe/Stockholm')).toBeNull();
  });
});

describe('locale-aware round-trip', () => {
  // Coverage for a locale with non-English meridiem text (ko). The snapshot
  // anchors the exact strings Stripes' pickers consume and emit; the
  // round-trip case proves the locale survives an Edit-and-Save cycle.
  const original = '2026-04-30T06:15:00+0000';

  beforeAll(async () => {
    await new Promise((resolve) => loadDayJSLocale('ko', resolve));
  });

  afterAll(async () => {
    await new Promise((resolve) => loadDayJSLocale('en', resolve));
  });

  it('matches the picker-normalized ko strings', () => {
    expect(splitDateTime(original, 'ko', 'Asia/Seoul')).toEqual({
      date: '2026. 04. 30.',
      time: '오후 15:15',
    });
  });

  it('ko round-trips', () => {
    const { date, time } = splitDateTime(original, 'ko', 'Asia/Seoul');
    expect(combineDateTime(date, time, 'ko', 'Asia/Seoul')).toBe(original);
  });
});

describe('formatDateTime', () => {
  const cases = [
    ['de', 'Europe/Berlin', '2023-06-20T06:00:00+0000', '20. Juni 2023 08:00'],
    ['en', 'America/New_York', '2023-06-20T02:00:00-0400', 'June 20, 2023 2:00 AM'],
    ['en-SE', 'Europe/Stockholm', '2026-04-30T06:15:00+0000', '30 April 2026 08:15'],
    ['en', 'America/New_York', undefined, '--'],
    ['en', 'America/New_York', 'garbage', '--'],
  ];

  test.each(cases)(
    '%s %s %s -> %s',
    (locale, timezone, dateTime, expected) => {
      expect(formatDateTime(dateTime, locale, timezone)).toBe(expected);
    }
  );
});
