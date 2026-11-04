import {
  isNil,
  mergeWith,
} from 'lodash';
import { useMemo } from 'react';

import {
  useOkapiKyMutation,
  useOkapiKyQuery,
} from '@folio/stripes-leipzig-components';

import ErrorHandlingForm from "./ErrorHandlingForm";
import {
  API_HARVESTER_ERROR_HANDLING,
  API_HARVESTER_ERROR_HANDLING_DEFAULTS,
  QK_HARVESTER_ERROR_HANDLING,
  QK_HARVESTER_ERROR_HANDLING_DEFAULTS,
} from '../../util/constants';

// Override every default value by values saved in the settings
const mergeWithDefaults = (defaults = {}, values = {}) => mergeWith(
  {},
  defaults,
  values,
  (defaultValue, value) => {
    if (isNil(value)) return defaultValue;
    return undefined;
  }
);

const ErrorHandling = () => {
  const { data: errorHandling, isLoading: isLoadingErrorHandling } = useOkapiKyQuery({
    queryKey: [QK_HARVESTER_ERROR_HANDLING],
    api: API_HARVESTER_ERROR_HANDLING,
  });

  const { data: errorHandlingDefaults, isLoading: isLoadingErrorHandlingDefaults } = useOkapiKyQuery({
    queryKey: [QK_HARVESTER_ERROR_HANDLING_DEFAULTS],
    api: API_HARVESTER_ERROR_HANDLING_DEFAULTS,
  });

  const { useCreate } = useOkapiKyMutation({
    mutationKey: [QK_HARVESTER_ERROR_HANDLING],
    api: API_HARVESTER_ERROR_HANDLING,
  });

  const { mutateAsync: createErrorHandling } = useCreate({
    onSuccess: () => {
      history.push(`${urls.sourceView(id)}${location.search}`);
    },
  });

  console.log(errorHandling);
  console.log(errorHandlingDefaults);

  const saveErrorHandling = (formValues, form) => {
    console.log('saveErrorHandling', formValues);
    return createErrorHandling(formValues);
  };

  const initialValues = useMemo(
    () => mergeWithDefaults(errorHandlingDefaults, errorHandling),
    [errorHandlingDefaults, errorHandling]
  );

  return (
    <ErrorHandlingForm
      initialValues={initialValues}
      isLoading={isLoadingErrorHandling || isLoadingErrorHandlingDefaults}
      onSubmit={saveErrorHandling}
    />
  );
};

export default ErrorHandling;
