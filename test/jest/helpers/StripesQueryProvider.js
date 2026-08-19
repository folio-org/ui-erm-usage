import PropTypes from 'prop-types';
import { useState } from 'react';
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }));

  return (
    <StripesContext.Provider value={stripes}>
      <QueryClientProvider client={queryClient}>
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
