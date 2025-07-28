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

// ------------------------------
// Format-Ermittlung
// ------------------------------

const normalizeLuxonFormat = (format) =>
  format.replace(/Y/g, 'y').replace(/m/g, 'M');

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

const getResolvedDateFormat = (locale, explicitFormat) => {
  if (explicitFormat) return normalizeLuxonFormat(explicitFormat);
  return normalizeLuxonFormat(getDateFormatFromLocale(locale));
};

// ------------------------------
// Validator
// ------------------------------

const monthpickerValidator = ({ isRequired = false, inputFormat }) => (value) => {
  if (isRequired && !value) {
    return <FormattedMessage id="ui-erm-usage.errors.required" />;
  }

  const dt = DateTime.fromFormat(value, inputFormat);
  if (value && !dt.isValid) {
    return <FormattedMessage id="ui-erm-usage.errors.dateInvalid" />;
  }

  return undefined;
};

// ------------------------------
// Monthpicker Component
// ------------------------------

const Monthpicker = ({
  backendDateFormat = 'yyyy-MM',
  dateFormat,
  input,
  isRequired,
  meta,
  textLabel = '',
  ...rest
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const lastValidDateRef = useRef({ year: null, month: null });
  const containerPopper = useRef(null);
  const containerTextField = useRef(null);
  const intl = useIntl();

  useClickOutside(containerPopper, () => {
    setShowCalendar(false);
  });

  const resolvedDateFormat = useMemo(
    () => getResolvedDateFormat(intl.locale, dateFormat),
    [intl.locale, dateFormat]
  );

  const resolvedBackendDateFormat = useMemo(
    () => normalizeLuxonFormat(backendDateFormat),
    [backendDateFormat]
  );

  const validator = useMemo(
    () => monthpickerValidator({ isRequired, inputFormat: resolvedDateFormat }),
    [isRequired, resolvedDateFormat]
  );

  const convertDateFormat = (value, from, to) => {
    const dt = DateTime.fromFormat(value, from);
    return dt.isValid ? dt.toFormat(to) : value;
  };

  const validationError = meta.touched && !meta.error
    ? validator(convertDateFormat(input.value, resolvedBackendDateFormat, resolvedDateFormat))
    : meta.error;

  useEffect(() => {
    const dt = DateTime.fromFormat(input?.value, resolvedBackendDateFormat);

    if (dt.isValid) {
      lastValidDateRef.current = {
        year: dt.year,
        month: dt.month
      };
    } else if (!lastValidDateRef.current.year || !lastValidDateRef.current.month) {
      const now = DateTime.local();

      lastValidDateRef.current = { year: now.year, month: now.month };
    }
  }, [input?.value, resolvedBackendDateFormat]);

  const buildDateString = (year, month, format) => {
    const dt = DateTime.fromObject({ year, month });

    return dt.toFormat(format);
  };

  const handleMonthSelect = (monthIndex) => {
    const year = lastValidDateRef.current.year ?? new Date().getFullYear();
    const dt = DateTime.fromObject({ year, month: monthIndex + 1 });

    input.onChange(dt.toFormat(resolvedBackendDateFormat));

    setShowCalendar(false);

    lastValidDateRef.current = { year, month: monthIndex + 1 };
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    if (year >= 1000 && year <= 9999) {
      lastValidDateRef.current = { ...lastValidDateRef.current, year };
    }
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
      onClick={() => setShowCalendar(!showCalendar)}
    />
  );

  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(intl.locale, { month: 'short' }).format(new Date(2000, i, 1)));

  return (
    <div ref={containerPopper}>
      <div ref={containerTextField}>
        <TextField
          aria-label={intl.formatMessage({ id: 'ui-erm-usage.monthpicker.yearMonthInput' })}
          endControl={renderEndElement()}
          error={validationError}
          label={textLabel}
          name={input.name}
          onBlur={input.onBlur}
          onChange={(e) => input.onChange(convertDateFormat(e.target.value, resolvedDateFormat, resolvedBackendDateFormat))}
          onFocus={input.onFocus}
          placeholder={resolvedDateFormat}
          required={isRequired}
          value={convertDateFormat(input.value, resolvedBackendDateFormat, resolvedDateFormat)}
          {...rest}
        />
      </div>

      <Popper
        anchorRef={containerTextField}
        isOpen={showCalendar}
        onToggle={() => setShowCalendar(false)}
      >
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
                {/* <TextField
                type="number"
                value={lastValidDateRef.current?.year}
                onChange={handleYearChange}
                hasClearIcon={false}
              /> */}
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
              {months.map((monthLabel, i) => (
                // using table is not wanted here, instead using 'row' and 'gridcell' and set a role
                // eslint-disable-next-line
                <div role="row" key={monthLabel}>
                  {/* eslint-disable-next-line */}
                  <div role="gridcell">
                    <Button
                      aria-label={i + 1 === lastValidDateRef.current.month ? `${monthLabel} selected` : monthLabel}
                      aria-pressed={i + 1 === lastValidDateRef.current.month}
                      buttonStyle={i + 1 === lastValidDateRef.current.month ? 'primary' : ''}
                      onClick={() => handleMonthSelect(i)}
                    >
                      {monthLabel}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HasCommand>
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
