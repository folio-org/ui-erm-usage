import React from 'react';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import HarvesterLogsSettings from './HarvesterLogsSettings';
import { DAYS_TO_KEEP_LOGS } from '../../util/constants';

const store = createStore(combineReducers({ form: formReducer }));

const renderHarvesterLogsSettings = (stripes, resources) => {
  if (resources) {
    stripes.connect =
      (Component) =>
        ({ ...props }) => {
          return <Component {...props} mutator={{}} resources={resources} />;
        };
  }
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <Provider store={store}>
        <MemoryRouter>
          <HarvesterLogsSettings />
        </MemoryRouter>
      </Provider>
    </StripesContext.Provider>
  );
};

describe('Harvester logs settings component', () => {
  const stripes = useStripes();
  const originalConnect = stripes.connect;

  beforeEach(() => {
    stripes.connect = originalConnect;
  });

  it('should render with value from resources', () => {
    const resources = {
      settings: { records: [{ configs: [{ value: '5' }] }], hasLoaded: true },
    };
    renderHarvesterLogsSettings(stripes, resources);
    expect(screen.getByRole('spinbutton').valueAsNumber).toBe(5);
  });

  it('should render with default value', () => {
    renderHarvesterLogsSettings(stripes);
    expect(screen.getByRole('heading', { name: 'Harvester logs' })).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Number of days to keep harvesting logs' })
        .valueAsNumber
    ).toBe(DAYS_TO_KEEP_LOGS);
  });
});
