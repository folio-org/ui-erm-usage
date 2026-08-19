import PropTypes from 'prop-types';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  ModuleHierarchyProvider,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

const StripesQueryProvider = ({ children }) => {
  const stripes = useStripes();

  return (
    <StripesContext.Provider value={stripes}>
      <QueryClientProvider client={new QueryClient()}>
        <ModuleHierarchyProvider module="@folio/erm-usage">
          {children}
        </ModuleHierarchyProvider>
      </QueryClientProvider>
    </StripesContext.Provider>
  );
};

StripesQueryProvider.propTypes = {
  children: PropTypes.node,
};

export default StripesQueryProvider;
