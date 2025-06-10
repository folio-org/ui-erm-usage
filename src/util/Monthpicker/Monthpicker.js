import { PropTypes } from 'prop-types';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  Button,
  Col,
  HasCommand,
  IconButton,
  Popper,
  TextField,
} from '@folio/stripes/components';

import css from './Monthpicker.css';

const Monthpicker = ({
  input,
  meta,
  isRequired,
  textLabel,
  dateFormat,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(null);
  const lastValidYearRef = useRef(null);
  const container = useRef(null);
  const intl = useIntl();

  const isValidYear = (year) => {
    return Number.isInteger(year) && year >= 1000 && year <= 9999;
  };

  const ensureValidYear = (year) => {
    if (isValidYear(year)) return year;
    return new Date().getFullYear();
  };

  const getYearAndMonthFromInput = (value) => {
    const today = new Date();
    const [rawYear, rawMonth] = (value || '').split('-');
    const year = parseInt(rawYear, 10);
    const month = parseInt(rawMonth, 10) - 1;

    return {
      year: isValidYear(year) ? year : today.getFullYear(),
      month: !Number.isNaN(month) && month >= 0 && month <= 11 ? month : today.getMonth(),
    };
  };

  const extractYearPlaceholders = (format) => {
    const yearMatch = format.match(/Y+/);
    return {
      yearPlaceholder: yearMatch ? yearMatch[0] : 'YYYY',
    };
  };

  const { yearPlaceholder } = extractYearPlaceholders(dateFormat);

  // set calendarDate and lastValidYearRef if the input is changing of if the calender just opened
  useEffect(() => {
    if (showCalendar) {
      const { year, month } = getYearAndMonthFromInput(input.value);
      setCalendarDate({ year, month });

      if (isValidYear(year)) {
        lastValidYearRef.current = year;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalendar, input.value]);

  const getLocalizedMonthAbbreviations = () => {
    return Array.from({ length: 12 }, (_, i) => {
      return new Intl.DateTimeFormat(intl.locale, { month: 'short' }).format(new Date(2000, i, 1));
    });
  };

  const months = getLocalizedMonthAbbreviations();

  const formatYearMonth = (year, monthIndex) => {
    return dateFormat
      .replace(/Y+/, ensureValidYear(year).toString())
      .replace(/M+/, (monthIndex + 1).toString().padStart(2, '0'));
  };

  const handleMonthSelect = (monthIndex) => {
    // use the last valid year, if calendarDate.year is not valid or null
    const year = isValidYear(calendarDate?.year)
      ? calendarDate.year
      : (lastValidYearRef.current ?? new Date().getFullYear());

    const formatted = formatYearMonth(year, monthIndex);
    input.onChange(formatted);
    setShowCalendar(false);
  };

  const handleYearChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    if (isValidYear(parsed)) {
      setCalendarDate(prev => ({ ...prev, year: parsed }));
      lastValidYearRef.current = parsed;
    }
  };

  const decrementYear = () => {
    setCalendarDate(prev => {
      const currentYear = isValidYear(prev?.year) ? prev.year : (lastValidYearRef.current ?? new Date().getFullYear());
      const newYear = currentYear - 1;
      lastValidYearRef.current = newYear;
      return { ...prev, year: newYear };
    });
  };

  const incrementYear = () => {
    setCalendarDate(prev => {
      const currentYear = isValidYear(prev?.year) ? prev.year : (lastValidYearRef.current ?? new Date().getFullYear());
      const newYear = currentYear + 1;
      lastValidYearRef.current = newYear;
      return { ...prev, year: newYear };
    });
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
    <div ref={container}>
      <TextField
        endControl={renderEndElement()}
        error={meta.touched ? meta.error : undefined}
        label={textLabel}
        name={input.name}
        onBlur={input.onBlur}
        onChange={input.onChange}
        onFocus={input.onFocus}
        placeholder={dateFormat}
        required={isRequired}
        value={input.value}
      />
    </div>;

  const renderCalendar = () => (
    <HasCommand
      commands={shortcuts}
      scope={document.body}
    >
      <div
        aria-label={intl.formatMessage({ id: 'ui-erm-usage.monthpicker.yearMonthSelection' })}
        className={css.calendar}
        // Popper component requires a 'div', which is why 'dialog' can not be used here and the 'role' is set instead
        role="dialog" // eslint-disable-line
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
                  placeholder={yearPlaceholder}
                  value={calendarDate?.year ?? new Date().getFullYear()}
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
          {months.map((month, index) => (
            // using table is not wanted here, instead using 'row' and 'gridcell' and set a role
            // eslint-disable-next-line
            <div role="row" key={month}>
              {/* eslint-disable-next-line */}
              <div role="gridcell">
                <Button
                  aria-label={index === calendarDate?.month ? `${month} selected` : month}
                  aria-pressed={index === calendarDate?.month}
                  buttonStyle={index === calendarDate?.month ? 'primary' : ''}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HasCommand>
  );

  return (
    <div>
      {content}
      <Popper
        anchorRef={container}
        isOpen={showCalendar}
        onToggle={toggleCalendar}
      >
        {renderCalendar()}
      </Popper>
    </div>
  );
};

Monthpicker.propTypes = {
  dateFormat: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  textLabel: PropTypes.string,
  meta: PropTypes.object,
};

export default Monthpicker;
