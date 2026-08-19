import PropTypes from 'prop-types';
import { useState } from 'react';
import { QueryClientProvider } from 'react-query';

import {
  createReactQueryClient,
  ModuleHierarchyProvider,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

const StripesQueryProvider = ({ children }) => {
  const stripes = useStripes();
  const [queryClient] = useState(() => createReactQueryClient());

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
