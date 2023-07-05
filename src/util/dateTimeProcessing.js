import moment from 'moment-timezone';

export const combineDateTime = (date, time, locale, timezone) => {
  const localeData = moment().locale(locale).localeData();
  const dateFormat = localeData.longDateFormat('L');
  const timeFormat = localeData.longDateFormat('LT');
  return moment
    .tz(
      date + ' ' + time,
      dateFormat + ' ' + timeFormat,
      timezone
    )
    .utc()
    .format('YYYY-MM-DDTHH:mm:ssZZ');
};

export const splitDateTime = (dateTime, locale, timezone) => {
  const dT = moment(dateTime).locale(locale).tz(timezone);
  return {
    date: dT.format('L'),
    time: dT.format('LT'),
  };
};

export const formatDateTime = (dateTime, locale, timezone) => {
  return dateTime
    ? moment
      .tz(dateTime, timezone)
      .locale(locale)
      .format('LLL')
    : '--';
};
