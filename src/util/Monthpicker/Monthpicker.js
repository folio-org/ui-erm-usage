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
  backendDateFormat = 'YYYY-MM',
  dateFormat,
  input,
  isRequired,
  meta,
  textLabel = '',
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const lastValidDateRef = useRef({ year: null, month: null });
  const container = useRef(null);
  const intl = useIntl();

  const resolvedDateFormat = useMemo(() => {
    return dateFormat ?? new Intl.DateTimeFormat(intl.locale, {
      year: 'numeric',
      month: '2-digit',
    }).format(new Date());
  }, [dateFormat, intl.locale]);

  const isValidYear = (year) => {
    const num = Number(year);
    return Number.isInteger(num) && num >= 1000 && num <= 9999;
  };

  const isValidMonth = (month) => {
    const monthIndex = month - 1;
    return !Number.isNaN(monthIndex) && monthIndex >= 0 && monthIndex <= 11;
  };

  const ensureValidMonth = (month) => {
    if (isValidMonth(month)) return month;
    return new Date().getMonth() + 1;
  };

  const ensureValidYear = (year) => {
    if (isValidYear(year)) return year;
    return new Date().getFullYear();
  };

  const extractYearAndMonth = (inputValue, format) => {
    // allowed separator between year and month
    const separators = ['-', '.', '/'];
    const separator = separators.find(sep => format.includes(sep));
    if (!separator) {
      throw new Error('unknown separator');
    }

    const formatParts = format.split(separator);
    const inputParts = inputValue.split(separator);

    let year;
    let month;

    formatParts.forEach((part, index) => {
      if (part.includes('Y')) {
        year = inputParts[index];
        if (part === 'YY' && year.length === 2) {
          year = parseInt(year, 10) >= 50 ? '19' + year : '20' + year;
        }
      } else if (part.includes('M')) {
        month = inputParts[index];
      }
    });

    lastValidDateRef.current = { year: parseInt(year, 10), month: parseInt(month, 10) };

    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
    };
  };

  const buildDateString = (year, monthIndex, format) => {
    return format
      .replace(/Y+/, ensureValidYear(year).toString())
      .replace(/M+/, (monthIndex).toString().padStart(2, '0'));
  };

  // set calendarDate and lastValidYearRef if the input is changing of if the calender just opened
  useEffect(() => {
    const { year, month } = extractYearAndMonth(input.value, resolvedDateFormat);
    const validYear = ensureValidYear(year);
    const validMonth = ensureValidMonth(month);

    lastValidDateRef.current = { year: validYear, month: validMonth };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalendar, input.value]);

  const getLocalizedMonthAbbreviations = () => {
    return Array.from({ length: 12 }, (_, i) => {
      return new Intl.DateTimeFormat(intl.locale, { month: 'short' }).format(new Date(2000, i, 1));
    });
  };

  const handleMonthSelect = (monthIndex) => {
    const year = (lastValidDateRef.current.year ?? new Date().getFullYear());
    const backendFormatted = buildDateString(year, monthIndex + 1, backendDateFormat);
    input.onChange(backendFormatted);

    setShowCalendar(false);

    lastValidDateRef.current = { year, month: monthIndex };
  };

  const handleYearChange = (e) => {
    lastValidDateRef.current = { ...lastValidDateRef.current, year: ensureValidYear(e.target.value) };
  };

  const decrementYear = () => {
    const newYear = lastValidDateRef.current?.year - 1;
    const currentMonth = lastValidDateRef.current?.month;
    lastValidDateRef.current = { month: currentMonth, year: newYear };

    const newValue = buildDateString(newYear, currentMonth, resolvedDateFormat);
    input.onChange(newValue);
  };

  const incrementYear = () => {
    const newYear = lastValidDateRef.current?.year + 1;
    const currentMonth = lastValidDateRef.current?.month;
    lastValidDateRef.current = { month: currentMonth, year: newYear };

    const newValue = buildDateString(newYear, currentMonth, resolvedDateFormat);
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
    <div ref={container}>
      <TextField
        endControl={renderEndElement()}
        error={meta.touched ? meta.error : undefined}
        label={textLabel}
        name={input.name}
        onBlur={input.onBlur}
        onChange={input.onChange}
        onFocus={input.onFocus}
        placeholder={resolvedDateFormat}
        required={isRequired}
        value={input.value ?? buildDateString(lastValidDateRef.current?.year, lastValidDateRef.current?.month, resolvedDateFormat)}
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
                  placeholder={(resolvedDateFormat.match(/Y+/) || [])[0]}
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
  backendDateFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  meta: PropTypes.object,
  textLabel: PropTypes.string,
};

export default Monthpicker;
