import React from 'react';
import { Form } from 'react-final-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';

import PeriodicHarvestingForm from './PeriodicHarvestingForm';

const stripes = {
  actionNames: [],
  clone: () => ({ ...stripes }),
  connect: () => {},
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => {},
  setCurrency: () => {},
  setLocale: () => {},
  setSinglePlugin: () => {},
  setTimezone: () => {},
  setToken: () => {},
  store: {
    getState: () => {},
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};
const onSubmit = jest.fn();
const renderPeriodicHarvestingForm = () => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={onSubmit}
          render={() => (
            <PeriodicHarvestingForm
              handleSubmit={jest.fn}
              onSubmit={onSubmit}
              onDelete={jest.fn}
              timeZone="UTC"
              initialValues={{}}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('PeriodicHarvestingForm', () => {
  test('test required fields', () => {
    const { getAllByText } = renderPeriodicHarvestingForm();
    userEvent.click(screen.getByText('Save'));
    expect(getAllByText('Required')).toHaveLength(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('test submit to be called', () => {
    const { getByLabelText, getByText } = renderPeriodicHarvestingForm();
    userEvent.type(
      getByLabelText('Start date', { exact: false }),
      '2021-01-01'
    );
    userEvent.type(getByText('Start time', { exact: false }), '5:01 AM');
    userEvent.selectOptions(
      getByLabelText('Periodic interval', { exact: false }),
      ['weekly']
    );
    userEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
