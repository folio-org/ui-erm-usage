import { PropTypes } from 'prop-types';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { DateTime } from 'luxon';

import {
  Button,
  Col,
  HasCommand,
  IconButton,
  Popper,
  TextField,
} from '@folio/stripes/components';

import { useClickOutside } from '../hooks/useClickOutside';
import css from './Monthpicker.css';

const Monthpicker = ({
  backendDateFormat = 'yyyy-MM',
  dateFormat,
  input,
  isRequired,
  meta,
  textLabel = '',
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const lastValidDateRef = useRef({ year: null, month: null });
  const containerPopper = useRef(null);
  const containerTextField = useRef(null);
  const intl = useIntl();

  useClickOutside(containerPopper, () => {
    setShowCalendar(false);
  });

  const normalizeLuxonFormat = (format) => {
    return format
      .replace(/Y/g, 'y')
      .replace(/m/g, 'M');
  };

  const getDateFormatFromLocale = (locale) => {
    const parts = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
    }).formatToParts(new Date());

    return parts
      .map((part) => {
        if (part.type === 'month') return 'MM';
        if (part.type === 'year') return 'yyyy';
        return part.value;
      })
      .join('');
  };

  const resolvedDateFormat = useMemo(() => {
    const localDate = getDateFormatFromLocale(intl.locale);
    return normalizeLuxonFormat(dateFormat ?? localDate);
  }, [dateFormat, intl.locale]);

  const resolvedBackendDateFormat = normalizeLuxonFormat(backendDateFormat);

  const isValidYear = (year) => {
    const num = Number(year);
    return Number.isInteger(num) && num >= 1000 && num <= 9999;
  };

  const ensureValidYear = (year) => {
    if (isValidYear(year)) return year;
    return new Date().getFullYear();
  };

  const buildDateString = (year, month, format) => {
    const dt = DateTime.fromObject({ year: ensureValidYear(year), month });
    return dt.toFormat(format);
  };

  useEffect(() => {
    const backendFormat = normalizeLuxonFormat(backendDateFormat);
    const dt = DateTime.fromFormat(input?.value, backendFormat);

    if (dt.isValid) {
      lastValidDateRef.current = {
        year: dt.year,
        month: dt.month
      };
    } else if (!lastValidDateRef.current.year || !lastValidDateRef.current.month) {
      const now = DateTime.local();
      lastValidDateRef.current = { year: now.year, month: now.month };
    }
  }, [input?.value, backendDateFormat]);

  const getLocalizedMonthAbbreviations = () => {
    return Array.from({ length: 12 }, (_, i) => {
      return new Intl.DateTimeFormat(intl.locale, { month: 'short' }).format(new Date(2000, i, 1));
    });
  };

  const convertDateFormat = (inputValue, fromFormat, toFormat) => {
    const dt = DateTime.fromFormat(inputValue, fromFormat);
    return dt.isValid ? dt.toFormat(toFormat) : '';
  };

  const handleMonthSelect = (monthIndex) => {
    const year = lastValidDateRef.current.year ?? new Date().getFullYear();
    const dt = DateTime.fromObject({ year, month: monthIndex + 1 });
    input.onChange(dt.toFormat(resolvedBackendDateFormat));

    setShowCalendar(false);

    lastValidDateRef.current = { year, month: monthIndex + 1 };
  };

  const handleYearChange = (e) => {
    lastValidDateRef.current = { ...lastValidDateRef.current, year: ensureValidYear(e.target.value) };
  };

  const decrementYear = () => {
    const newYear = lastValidDateRef.current?.year - 1;
    const currentMonth = lastValidDateRef.current?.month;
    lastValidDateRef.current = { month: currentMonth, year: newYear };

    const newValue = buildDateString(newYear, currentMonth, resolvedBackendDateFormat);
    input.onChange(newValue);
  };

  const incrementYear = () => {
    const newYear = lastValidDateRef.current?.year + 1;
    const currentMonth = lastValidDateRef.current?.month;
    lastValidDateRef.current = { month: currentMonth, year: newYear };

    const newValue = buildDateString(newYear, currentMonth, resolvedBackendDateFormat);
    input.onChange(newValue);
  };

  const toggleCalendar = () => {
    setShowCalendar(cur => !cur);
  };

  const shortcuts = [
    {
      name: 'close',
      handler: () => setShowCalendar(false),
      shortcut: 'esc',
    },
  ];

  const renderEndElement = () => (
    <IconButton
      aria-haspopup="true"
      icon="calendar"
      id="monthpicker-toggle-calendar-button"
      onClick={toggleCalendar}
    />
  );

  const content =
    <div ref={containerTextField}>
      <TextField
        aria-label={intl.formatMessage({ id: 'ui-erm-usage.monthpicker.yearMonthInput' })}
        endControl={renderEndElement()}
        error={meta.touched ? meta.error : undefined}
        label={textLabel}
        name={input.name}
        onBlur={input.onBlur}
        onChange={(e) => input.onChange(convertDateFormat(e.target.value, resolvedDateFormat, resolvedBackendDateFormat))}
        onFocus={input.onFocus}
        placeholder={resolvedDateFormat}
        required={isRequired}
        value={convertDateFormat(input.value, resolvedBackendDateFormat, resolvedDateFormat)}
      />
    </div>;

  const months = getLocalizedMonthAbbreviations();

  const renderCalendar = () => (
    <HasCommand
      commands={shortcuts}
      scope={document.body}
    >
      {/* Popper component requires a 'div', which is why 'dialog' can not be used here and 'role' is set instead */}
      {/* eslint-disable-next-line */}
      <div
        aria-label={intl.formatMessage({ id: 'ui-erm-usage.monthpicker.yearMonthSelection' })}
        className={css.calendar}
        role="dialog"
      >
        <fieldset className={css.calendarHeader}>
          <legend className="sr-only">
            {intl.formatMessage({ id: 'ui-erm-usage.monthpicker.yearSelection' })}
          </legend>
          <FormattedMessage id="stripes-components.goToPreviousYear">
            {([ariaLabel]) => (
              <IconButton
                aria-label={ariaLabel}
                className={css.marginBottom}
                icon="chevron-double-left"
                onClick={decrementYear}
              />
            )}
          </FormattedMessage>
          <Col xs={4}>
            <FormattedMessage id="stripes-components.Datepicker.yearControl">
              {([ariaLabel]) => (
                <TextField
                  aria-label={ariaLabel}
                  hasClearIcon={false}
                  type="number"
                  placeholder={(resolvedDateFormat.match(/y+/) || [])[0]}
                  value={lastValidDateRef.current?.year}
                  onChange={e => handleYearChange(e)}
                />
              )}
            </FormattedMessage>
          </Col>
          <FormattedMessage id="stripes-components.goToNextYear">
            {([ariaLabel]) => (
              <IconButton
                aria-label={ariaLabel}
                className={css.marginBottom}
                icon="chevron-double-right"
                onClick={incrementYear}
              />
            )}
          </FormattedMessage>
        </fieldset>

        <div
          aria-label={intl.formatMessage({ id: 'ui-erm-usage.monthpicker.monthSelection' })}
          className={css.calendarMonths}
          role="grid"
        >
          {months.map((monthButton, index) => (
            // using table is not wanted here, instead using 'row' and 'gridcell' and set a role
            // eslint-disable-next-line
            <div role="row" key={monthButton}>
              {/* eslint-disable-next-line */}
              <div role="gridcell">
                <Button
                  aria-label={index + 1 === lastValidDateRef.current.month ? `${monthButton} selected` : monthButton}
                  aria-pressed={index + 1 === lastValidDateRef.current.month}
                  buttonStyle={index + 1 === lastValidDateRef.current.month ? 'primary' : ''}
                  onClick={() => handleMonthSelect(index)}
                >
                  {monthButton}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HasCommand>
  );

  return (
    <div ref={containerPopper}>
      {content}
      <Popper
        anchorRef={containerTextField}
        isOpen={showCalendar}
        onToggle={toggleCalendar}
      >
        {renderCalendar()}
      </Popper>
    </div>
  );
};

Monthpicker.propTypes = {
  backendDateFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  meta: PropTypes.object,
  textLabel: PropTypes.string,
};

export default Monthpicker;
