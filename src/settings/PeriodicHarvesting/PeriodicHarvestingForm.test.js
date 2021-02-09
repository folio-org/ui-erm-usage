import React from 'react';
import { Form } from 'react-final-form';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';

import PeriodicHarvestingForm from './PeriodicHarvestingForm';

const initialValues = {
  startDate: '2021-01-01',
  startTime: '2021-01-01T07:00:00+00:00',
  periodicInterval: 'weekly',
};

const onSubmit = jest.fn();
const onDelete = jest.fn();
const renderPeriodicHarvestingForm = (stripes, initialVals = {}) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={onSubmit}
          render={() => (
            <PeriodicHarvestingForm
              handleSubmit={jest.fn}
              onSubmit={onSubmit}
              onDelete={onDelete}
              timeZone="UTC"
              initialValues={initialVals}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('PeriodicHarvestingForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('test required fields', () => {
    renderPeriodicHarvestingForm(stripes);
    userEvent.click(screen.getByText('Save'));
    expect(screen.getAllByText('Required')).toHaveLength(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('test submit to be called', () => {
    renderPeriodicHarvestingForm(stripes);
    userEvent.type(
      screen.getByLabelText('Start date', { exact: false }),
      '2021-01-01'
    );
    userEvent.type(screen.getByText('Start time', { exact: false }), '5:01 AM');
    userEvent.selectOptions(
      screen.getByLabelText('Periodic interval', { exact: false }),
      ['weekly']
    );
    userEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalled();
  });

  test('test cancel delete', async () => {
    renderPeriodicHarvestingForm(stripes, initialValues);
    userEvent.click(screen.getByText('Delete'));
    expect(
      screen.getByText(
        'Do you really want to delete the periodic harvesting config?'
      )
    ).toBeInTheDocument();
    const cancel = screen.getByText('Cancel');
    expect(cancel).toBeInTheDocument();
    userEvent.click(cancel);
    await waitForElementToBeRemoved(() => screen.getByText('Cancel'));
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('test do delete', async () => {
    renderPeriodicHarvestingForm(stripes, initialValues);
    userEvent.click(screen.getByText('Delete'));
    expect(
      screen.getByText(
        'Do you really want to delete the periodic harvesting config?'
      )
    ).toBeInTheDocument();
    const submit = screen.getByText('Submit');
    expect(submit).toBeInTheDocument();
    userEvent.click(submit);
    await waitForElementToBeRemoved(() => screen.getByText('Submit'));
    expect(onDelete).toHaveBeenCalled();
  });
});
