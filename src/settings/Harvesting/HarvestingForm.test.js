import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import periodicConfig from '../../../test/fixtures/periodicConfig';
import renderWithIntl from '../../../test/jest/helpers';
import HarvestingForm from './HarvestingForm';

const initialValues = {
  enablePeriodic: false,
  ...periodicConfig,
  date: '10/14/2026',
  time: '08:00 AM',
};

const onSubmit = jest.fn();
const onStartHarvester = jest.fn();

const renderHarvestingForm = (stripes, { initialVals = initialValues, isLoading = false } = {}) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <HarvestingForm
          initialValues={initialVals}
          isLoading={isLoading}
          onStartHarvester={onStartHarvester}
          onSubmit={onSubmit}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

const getEnableCheckbox = () => screen.getByRole('checkbox', { name: 'Enable periodic harvesting' });
const getIntervalSelect = () => screen.getByRole('combobox', { name: 'Periodic interval' });
const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

describe('HarvestingForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    onSubmit.mockClear();
    onStartHarvester.mockClear();
  });

  it('should render the sections', () => {
    renderHarvestingForm(stripes);

    expect(screen.getByRole('heading', { name: 'Start harvester' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
  });

  it('should show the initial values', () => {
    renderHarvestingForm(stripes);

    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('10/14/2026');
    expect(getIntervalSelect()).toHaveValue('weekly');
  });

  it('should hide the fields while loading', () => {
    renderHarvestingForm(stripes, { isLoading: true });

    expect(screen.queryByRole('checkbox', { name: 'Enable periodic harvesting' })).not.toBeInTheDocument();
  });

  it('should call onStartHarvester if the start button is clicked', async () => {
    renderHarvestingForm(stripes);

    await userEvent.click(screen.getByRole('button', { name: 'Start harvester' }));

    expect(onStartHarvester).toHaveBeenCalled();
  });

  it('should disable the fields until periodic harvesting is enabled', async () => {
    renderHarvestingForm(stripes);

    expect(getEnableCheckbox()).not.toBeChecked();
    expect(getIntervalSelect()).toBeDisabled();

    await userEvent.click(getEnableCheckbox());
    expect(getIntervalSelect()).toBeEnabled();
  });

  it('should enable the save button only if the form has changed', async () => {
    renderHarvestingForm(stripes);
    expect(getSaveButton()).toBeDisabled();

    await userEvent.click(getEnableCheckbox());
    expect(getSaveButton()).toBeEnabled();
  });

  it('should submit the changed values', async () => {
    renderHarvestingForm(stripes);

    await userEvent.click(getEnableCheckbox());
    await userEvent.selectOptions(getIntervalSelect(), 'monthly');
    await userEvent.click(getSaveButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ enablePeriodic: true, periodicInterval: 'monthly' }),
      expect.anything(),
      expect.anything()
    );
  });

  it('should require date and time if periodic harvesting is enabled', async () => {
    renderHarvestingForm(stripes, { initialVals: { enablePeriodic: false, periodicInterval: 'daily' } });

    await userEvent.click(getEnableCheckbox());
    await userEvent.click(getSaveButton());

    expect(screen.getByText('Please enter a valid date')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
