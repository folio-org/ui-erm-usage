import _ from 'lodash';
import React from 'react';
import {
  FormattedMessage
} from 'react-intl';

const required = (value) => {
  if (value) return undefined;
  return <FormattedMessage id="ui-erm-usage.errors.required" />;
};

const notRequired = () => (
  undefined
);

const mail = (value) => {
  const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (value && !mailRegex.test(value)) {
    return <FormattedMessage id="ui-erm-usage.errors.emailInvalid" />;
  }

  return undefined;
};

const yyyyMMRegex = /^[12]\d{3}-(0[1-9]|1[0-2])$/;

const yearMonth = (value) => {
  if (value && !yyyyMMRegex.test(value)) {
    return <FormattedMessage id="ui-erm-usage.errors.dateInvalid" />;
  }
  return undefined;
};

const endDate = (value, allValues) => {
  if (!value) {
    return undefined;
  }

  const stateDate = _.get(allValues, 'harvestingConfig.harvestingStart', '');
  if (new Date(value) < new Date(stateDate)) {
    return <FormattedMessage id="ui-erm-usage.errors.endDateMustBeGraterStartDate" />;
  }

  return undefined;
};

const isYearMonth = (value) => {
  if (value && yyyyMMRegex.test(value)) {
    return true;
  }
  return false;
};

export { endDate, isYearMonth, mail, notRequired, required, yearMonth };
