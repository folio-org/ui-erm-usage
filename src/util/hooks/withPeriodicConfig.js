import React from 'react';
import usePeriodicConfig from './usePeriodicConfig';

const withPeriodicConfig = (WrappedComponent) => {
  return (props) => {
    const periodicConfig = usePeriodicConfig();
    return <WrappedComponent periodicConfig={periodicConfig} {...props} />;
  };
};

export default withPeriodicConfig;
