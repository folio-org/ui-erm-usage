import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

const required = value => {
  if (value) return undefined;
  return <FormattedMessage id="ui-erm-usage.errors.required" />;
};

const notRequired = () => undefined;

const requiredArray = value => {
  if (value && value.length > 0) return undefined;
  return <FormattedMessage id="ui-erm-usage.errors.required" />;
};

const mail = value => {
  const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (value && !mailRegex.test(value)) {
    return <FormattedMessage id="ui-erm-usage.errors.emailInvalid" />;
  }

  return undefined;
};

const yyyyMMRegex = /^[12]\d{3}-(0[1-9]|1[0-2])$/;

const yearMonth = value => {
  if (value && !yyyyMMRegex.test(value)) {
    return <FormattedMessage id="ui-erm-usage.errors.dateInvalid" />;
  }
  return undefined;
};

const endDate = values => {
  if (!values || !values.harvestingConfig) {
    return undefined;
  }

  if (!values.harvestingConfig.harvestingStart && !values.harvestingConfig.harvestingEnd) {
    return undefined;
  }

  const errors = {};
  const start = get(values, 'harvestingConfig.harvestingStart', '');
  const end = get(values, 'harvestingConfig.harvestingEnd', '');
  if (new Date(end) < new Date(start)) {
    errors.harvestingConfig = {};
    errors.harvestingConfig.harvestingEnd = <FormattedMessage id="ui-erm-usage.errors.endDateMustBeGraterStartDate" />;
  }
  return errors;
};

const isYearMonth = value => {
  if (value && yyyyMMRegex.test(value)) {
    return true;
  }
  return false;
};

const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const isValidUrl = (url) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const requiredValidateUrl = value => {
  const urlRegex = /^https?:\/\/[^\s]/;
  if (urlRegex.test(value)) return undefined;
  return <FormattedMessage id="ui-erm-usage.errors.urlRequired" />;
};

export {
  composeValidators,
  endDate,
  isValidUrl,
  isYearMonth,
  mail,
  notRequired,
  required,
  requiredArray,
  yearMonth,
  requiredValidateUrl,
};
