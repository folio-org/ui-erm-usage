import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import PeriodicHarvestingForm from './PeriodicHarvestingForm';
import periodicHarvestingIntervals from '../../util/data/periodicHarvestingIntervals';

const stubInitialValues = {
  startAt: '2021-01-01T07:00:00.0000+0000',
  periodicInterval: 'weekly',
  lastTriggeredAt: '2021-01-08T07:00:00.0000+0000',
  date: '01/01/2021',
  time: '7:00 AM',
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

  test('test empty inital values', async () => {
    renderPeriodicHarvestingForm(stripes);

    screen.getAllByRole('textbox').forEach((i) => expect(i.value).toBe(''));
    expect(screen.getByRole('combobox').value).toBe(
      periodicHarvestingIntervals[0].value
    );
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();

    await userEvent.click(screen.getByText('Save'));
    expect(screen.queryAllByText('Required')).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('test non-empty inital values', async () => {
    renderPeriodicHarvestingForm(stripes, stubInitialValues);

    expect(screen.getAllByRole('textbox').map((i) => i.value)).toEqual([
      '01/01/2021',
      '7:00 AM',
    ]);
    expect(screen.getByRole('combobox').value).toBe('weekly');
    expect(screen.getByDisplayValue('Weekly')).toBeInTheDocument();
    expect(screen.getByText('January 8, 2021 7:00 AM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();

    await userEvent.click(screen.getByText('Save'));
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
  });

  test('test submit to be called', async () => {
    renderPeriodicHarvestingForm(stripes);
    await userEvent.type(
      screen.getByLabelText('Start date', { exact: false }),
      '01/01/2021'
    );
    await userEvent.type(screen.getByText('Start time', { exact: false }), '5:01 AM');
    await userEvent.selectOptions(
      screen.getByLabelText('Periodic interval', { exact: false }),
      ['weekly']
    );
    await userEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalled();
  });

  test('test cancel delete', async () => {
    renderPeriodicHarvestingForm(stripes, stubInitialValues);
    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Do you really want to delete the periodic harvesting config?')).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('test do delete', async () => {
    renderPeriodicHarvestingForm(stripes, stubInitialValues);
    await userEvent.click(screen.getByText('Delete'));
    expect(
      screen.getByText(
        'Do you really want to delete the periodic harvesting config?'
      )
    ).toBeInTheDocument();
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);
    expect(submitButton).not.toBeInTheDocument();
    expect(onDelete).toHaveBeenCalled();
  });
});
