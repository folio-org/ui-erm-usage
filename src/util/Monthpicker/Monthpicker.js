import { DateTime } from 'luxon';
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
}) => {
  const intl = useIntl();
  const resolvedDateFormat = getResolvedDateFormat(intl.locale, dateFormat);

  const resolvedBackendDateFormat = normalizeToLuxonFormat(backendDateFormat);

  return (
    <Field
      name={name}
      validate={monthpickerValidator({ isRequired, inputFormat: resolvedBackendDateFormat })}
    >
      {({ input, meta }) => (
        <MonthpickerInput
          input={input}
          meta={meta}
          isRequired={isRequired}
          backendDateFormat={resolvedBackendDateFormat}
          dateFormat={resolvedDateFormat}
          textLabel={textLabel}
        />
      )}
    </Field>
  );
};

export default Monthpicker;
