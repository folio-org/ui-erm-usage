import { render } from '@folio/jest-config-stripes/testing-library/react';

import Intl from '../__mock__/intl.mock';

const renderWithIntl = (children, renderer = render) => {
  return renderer(<Intl>{children}</Intl>);
};

export default renderWithIntl;
