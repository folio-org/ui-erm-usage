import { render } from '@folio/jest-config-stripes/testing-library/react';

import Intl from '../__mock__/intl.mock';
import StripesQueryProvider from './StripesQueryProvider';

// StripesQueryProvider: components using react-query hooks (e.g. useOkapiKyMutation) need
// a QueryClient and a StripesContext; providers set in a test take precedence
const renderWithIntl = (children, renderer = render, locale = 'en') => {
  return renderer(
    <Intl locale={locale}>
      <StripesQueryProvider>{children}</StripesQueryProvider>
    </Intl>
  );
};

export default renderWithIntl;
