import {
  dayjs,
  getLocaleDateFormat,
} from '@folio/stripes/components';

const TIME_FORMAT_CONFIG = { hour: 'numeric', minute: 'numeric' };

const DATE_FORMAT_CONFIG = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

// getLocaleDateFormat emits unpadded hour tokens (H, h) regardless of the
// requested Intl `hour` style. Pad the 24-hour token (H -> HH) so 24-hour
// locales render with a leading zero (e.g. "08:00") as users expect; leave
// 12-hour locales unpadded ("2:00 AM"), which is the conventional form.
const padTwentyFourHourToken = (format) => format.replaceAll('H', 'HH');

const getDateFormat = (locale) => getLocaleDateFormat({ intl: { locale } });

const getRawTimeFormat = (locale) => getLocaleDateFormat({ intl: { locale }, config: TIME_FORMAT_CONFIG });

// Format used to *render* a time. Padded so 24-hour locales show a leading
// zero (e.g. "08:00").
const getTimeFormat = (locale) => padTwentyFourHourToken(getRawTimeFormat(locale));

export const combineDateTime = (date, time, locale, timezone) => {
  try {
    const datePart = getDateFormat(locale);
    // Accept both the padded display format ("08:00", as emitted by
    // splitDateTime) and the raw unpadded format ("8:15", "0:00", as emitted
    // by Stripes' Timepicker for 24-hour locales). Strict parsing against the
    // padded format alone rejects the Timepicker's output, yielding a null
    // startAt that the backend rejects with "must not be null".
    //
    // No locale is passed to dayjs: it parses against the globally-loaded dayjs
    // locale, which Stripes sets to the active locale's compatible dayjs locale
    // via loadDayJSLocale at startup. Passing the raw UI locale instead would
    // break locale-specific tokens (the AM/PM meridiem) for region locales such
    // as en-US, whose data dayjs never loads (only the parent "en"). The format
    // strings are still derived from the full UI locale.
    const local = dayjs(
      `${date} ${time}`,
      [
        `${datePart} ${getTimeFormat(locale)}`,
        `${datePart} ${getRawTimeFormat(locale)}`,
      ],
      true
    );

    if (local.isValid()) {
      return local.tz(timezone, true).utc()
        .format('YYYY-MM-DDTHH:mm:ssZZ');
    }
  } catch (e) {
    console.warn(`combineDateTime failed to parse "${date} ${time}" (${locale}):`, e); // eslint-disable-line no-console
  }

  return null;
};

export const splitDateTime = (dateTime, locale, timezone) => {
  try {
    const dT = dayjs(dateTime).tz(timezone)
      .locale(locale);

    if (dT.isValid()) {
      return {
        date: dT.format(getDateFormat(locale)),
        time: dT.format(getTimeFormat(locale)),
      };
    }
  } catch (e) {
    console.warn(`splitDateTime failed to parse "${dateTime}" (${locale}):`, e); // eslint-disable-line no-console
  }

  return { date: '', time: '' };
};

export const formatDateTime = (dateTime, locale, timezone) => {
  if (dateTime) {
    const date = new Date(dateTime);

    if (Number.isFinite(date.getTime())) {
      return [
        new Intl.DateTimeFormat(locale, { ...DATE_FORMAT_CONFIG, timeZone: timezone }).format(date),
        new Intl.DateTimeFormat(locale, { ...TIME_FORMAT_CONFIG, timeZone: timezone }).format(date),
      ].join(' ');
    }
  }

  return '--';
};
