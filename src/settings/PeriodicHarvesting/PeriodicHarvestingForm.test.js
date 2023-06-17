import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';

const stubInitialValues = {
  date: '01/01/2021',
  time: '7:00 AM',
  periodicInterval: 'weekly',
};

const onSubmit = jest.fn();
const onDelete = jest.fn();
const renderPeriodicHarvestingForm = (stripes, initialVals = {}) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <PeriodicHarvestingForm
          onSubmit={onSubmit}
          onDelete={onDelete}
          initialValues={initialVals}
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

  test('test required fields and combobox initial value', () => {
    renderPeriodicHarvestingForm(stripes);
    userEvent.click(screen.getByText('Save'));
    expect(screen.getAllByText('Required')).toHaveLength(2);
    expect(screen.getByRole('combobox').value).toBe(
      periodicHarvestingIntervals[0].value
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('test submit to be called', () => {
    renderPeriodicHarvestingForm(stripes);
    userEvent.type(
      screen.getByLabelText('Start date', { exact: false }),
      '01/01/2021'
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
    renderPeriodicHarvestingForm(stripes, stubInitialValues);
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
    renderPeriodicHarvestingForm(stripes, stubInitialValues);
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
