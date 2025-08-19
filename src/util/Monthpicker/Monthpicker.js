import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import MonthpickerInput from './MonthpickerInput';

const normalizeToLuxonFormat = (format) =>
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
  const format = explicitFormat || getDateFormatFromLocale(locale);
  return normalizeToLuxonFormat(format);
};

const monthpickerValidator = ({ isRequired, inputFormat }) => (value) => {
  if (isRequired && !value) {
    return <FormattedMessage id="ui-erm-usage.errors.required" />;
  }

  if (value) {
    const dt = DateTime.fromFormat(value, inputFormat);
    if (!dt.isValid) {
      return <FormattedMessage id="ui-erm-usage.errors.dateInvalid" />;
    }
  }

  return undefined;
};

const Monthpicker = ({
  backendDateFormat = 'yyyy-MM',
  dateFormat,
  isRequired = false,
  name,
  textLabel,
  onValidityChange,
}) => {
  const intl = useIntl();
  const resolvedDateFormat = getResolvedDateFormat(intl.locale, dateFormat);

  const resolvedBackendDateFormat = normalizeToLuxonFormat(backendDateFormat);

  const validator = useMemo(
    () => monthpickerValidator({ isRequired, inputFormat: resolvedBackendDateFormat }),
    [isRequired, resolvedBackendDateFormat]
  );

  return (
    <Field
      name={name}
      validate={validator}
      key={isRequired ? 'required' : 'optional'}
    >
      {({ input, meta }) => (
        <MonthpickerInput
          input={input}
          meta={meta}
          isRequired={isRequired}
          backendDateFormat={resolvedBackendDateFormat}
          dateFormat={resolvedDateFormat}
          textLabel={textLabel}
          onValidityChange={onValidityChange}
        />
      )}
    </Field>
  );
};

export default Monthpicker;
