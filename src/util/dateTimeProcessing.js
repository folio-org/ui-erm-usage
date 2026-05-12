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

const getTimeFormat = (locale) => {
  const format = getLocaleDateFormat({ intl: { locale }, config: TIME_FORMAT_CONFIG });
  return padTwentyFourHourToken(format);
};

export const combineDateTime = (date, time, locale, timezone) => {
  try {
    const local = dayjs(
      `${date} ${time}`,
      `${getDateFormat(locale)} ${getTimeFormat(locale)}`,
      locale,
      true
    );

    if (local.isValid()) {
      return local.tz(timezone, true).utc()
        .format('YYYY-MM-DDTHH:mm:ssZZ');
    }
  } catch {
    // fall through
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
  } catch {
    // fall through
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
