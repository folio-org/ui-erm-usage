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

const convertDateFormat = (value, from, to) => {
  if (!value) return '';
  const dt = DateTime.fromFormat(value, from);
  return dt.isValid ? dt.toFormat(to) : value;
};

const MonthpickerInput = ({
  backendDateFormat,
  dateFormat,
  input,
  isRequired,
  meta,
  textLabel = '',
  onValidityChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showError, setShowError] = useState(false);
  const lastValidDateRef = useRef({ year: null, month: null });
  const containerPopper = useRef(null);
  const containerTextField = useRef(null);
  const intl = useIntl();

  const handleInternalBlur = (e) => {
    const nextTarget = e.relatedTarget;

    // block blur as long as no click outsinde the field-monthpicker-container is happening
    if (
      nextTarget &&
      containerPopper.current &&
      containerPopper.current.contains(nextTarget)
    ) {
      return;
    }

    setShowError(true);
    input.onBlur?.(e);

    // callback to trigger error in form outside of Monthpicker
    if (onValidityChange) {
      onValidityChange(!meta.error);
    }
  };

  useClickOutside(containerPopper, () => {
    setShowCalendar(false);
  });

  const validationError = showError ? meta.error : undefined;

  useEffect(() => {
    if (!backendDateFormat) return;

    if (!input?.value) {
      const now = DateTime.local();
      lastValidDateRef.current = { year: now.year, month: now.month };
      return;
    }

    const dt = DateTime.fromFormat(input.value, backendDateFormat);

    if (dt.isValid) {
      lastValidDateRef.current = { year: dt.year, month: dt.month };
    } else if (!lastValidDateRef.current.year || !lastValidDateRef.current.month) {
      const now = DateTime.local();
      lastValidDateRef.current = { year: now.year, month: now.month };
    }
  }, [input?.value, backendDateFormat]);

  const buildDateString = (year, month, format) => {
    const dt = DateTime.fromObject({ year, month });
    return dt.toFormat(format);
  };

  const handleMonthSelect = (monthIndex) => {
    const year = lastValidDateRef.current.year ?? new Date().getFullYear();
    const dt = DateTime.fromObject({ year, month: monthIndex + 1 });

    lastValidDateRef.current = { year, month: monthIndex + 1 };

    const formattedValue = dt.toFormat(backendDateFormat);
    input.onChange(formattedValue);

    setShowCalendar(false);
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
    const newValue = buildDateString(newYear, currentMonth, backendDateFormat);

    input.onChange(newValue);
  };

  const incrementYear = () => {
    const newYear = lastValidDateRef.current?.year + 1;
    const currentMonth = lastValidDateRef.current?.month;

    lastValidDateRef.current = { month: currentMonth, year: newYear };
    const newValue = buildDateString(newYear, currentMonth, backendDateFormat);

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
          onBlur={handleInternalBlur}
          onChange={(e) => input.onChange(convertDateFormat(e.target.value, dateFormat, backendDateFormat))}
          onFocus={(e) => {
            input.onFocus(e);
          }}
          placeholder={dateFormat}
          required={isRequired}
          value={convertDateFormat(input.value, backendDateFormat, dateFormat)}
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
                <FormattedMessage id="stripes-components.Datepicker.yearControl">
                  {([ariaLabel]) => (
                    <TextField
                      aria-label={ariaLabel}
                      hasClearIcon={false}
                      type="number"
                      placeholder={(dateFormat.match(/y+/) || [])[0]}
                      value={lastValidDateRef.current?.year}
                      onChange={handleYearChange}
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

MonthpickerInput.propTypes = {
  backendDateFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  meta: PropTypes.object,
  textLabel: PropTypes.string,
  onValidityChange: PropTypes.func,
};

export default MonthpickerInput;
