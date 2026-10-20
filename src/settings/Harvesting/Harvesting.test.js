import {
  Link,
  MemoryRouter,
} from 'react-router-dom';

import {
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  CalloutContext,
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import periodicConfig from '../../../test/fixtures/periodicConfig';
import renderWithIntl from '../../../test/jest/helpers';
import usePeriodicConfig from '../../util/hooks/usePeriodicConfig';
import Harvesting from './Harvesting';

jest.mock('../../util/hooks/usePeriodicConfig');

const renderHarvesting = (stripes, sendCallout) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <CalloutContext.Provider value={{ sendCallout }}>
        <MemoryRouter>
          <Harvesting />
          <Link to="/other">Leave page</Link>
        </MemoryRouter>
      </CalloutContext.Provider>
    </StripesContext.Provider>
  );
};

const findEnableCheckbox = () => screen.findByRole('checkbox', { name: 'Enable periodic harvesting' });
const getIntervalSelect = () => screen.getByRole('combobox', { name: 'Periodic interval' });
const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

const selectInterval = async (interval) => {
  await findEnableCheckbox();
  await userEvent.selectOptions(getIntervalSelect(), interval);
};

describe('Harvesting', () => {
  const stripes = useStripes();
  const sendCallout = jest.fn();
  let fetchConfig;
  let saveConfig;
  let deleteConfig;
  usePeriodicConfig.mockImplementation(() => ({ fetchConfig, saveConfig, deleteConfig }));

  beforeEach(() => {
    sendCallout.mockClear();
    fetchConfig = jest.fn().mockResolvedValue(periodicConfig);
    saveConfig = jest.fn().mockResolvedValue();
    deleteConfig = jest.fn().mockResolvedValue();
  });

  it('should show the fetched configuration with periodic harvesting enabled', async () => {
    renderHarvesting(stripes, sendCallout);

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('10/14/2026'));
    expect(getIntervalSelect()).toHaveValue('weekly');
    expect(await findEnableCheckbox()).toBeChecked();
    expect(getIntervalSelect()).toBeEnabled();
  });

  it('should show periodic harvesting disabled if no configuration exists', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    expect(await findEnableCheckbox()).not.toBeChecked();
    expect(getIntervalSelect()).toBeDisabled();
  });

  it('should show empty fields if no configuration exists', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    await findEnableCheckbox();
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /^Start time/ })).toHaveValue('');
    expect(getIntervalSelect()).toHaveValue('');
  });

  it('should require date, time and interval if periodic harvesting is enabled without a configuration', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());

    expect(screen.getByText('Please enter a valid date')).toBeInTheDocument();
    expect(screen.getAllByText('Required')).toHaveLength(2);
    expect(saveConfig).not.toHaveBeenCalled();
  });

  it('should save a new configuration once all fields are filled in', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.type(screen.getByRole('textbox', { name: 'Start date' }), '10/21/2026{Escape}');
    await userEvent.click(screen.getByRole('textbox', { name: /^Start time/ }));
    await userEvent.paste('8:00 AM');
    await selectInterval('weekly');
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(saveConfig).toHaveBeenCalledWith({
      startAt: '2026-10-21T08:00:00+0000',
      periodicInterval: 'weekly',
    }));
  });

  it('should show an error callout if fetching fails', async () => {
    fetchConfig = jest.fn().mockRejectedValue(new Error('fetch failed'));
    renderHarvesting(stripes, sendCallout);

    expect(await findEnableCheckbox()).toBeInTheDocument();
    expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Error: fetch failed' });
  });

  it('should disable the save button again if periodic harvesting is disabled and enabled', async () => {
    renderHarvesting(stripes, sendCallout);

    const checkbox = await findEnableCheckbox();
    await userEvent.click(checkbox);
    await userEvent.click(checkbox);

    expect(getSaveButton()).toBeDisabled();
  });

  it('should save the configuration without the non-persisted enablePeriodic flag', async () => {
    renderHarvesting(stripes, sendCallout);

    await selectInterval('monthly');
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));
    expect(saveConfig).toHaveBeenCalledWith({ startAt: '2026-10-14T08:00:00+0000', periodicInterval: 'monthly' });
  });

  it('should keep showing the last triggered date after saving', async () => {
    renderHarvesting(stripes, sendCallout);

    await selectInterval('monthly');
    await userEvent.click(getSaveButton());
    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));

    expect(screen.getByText('October 7, 2026 8:00 AM')).toBeInTheDocument();
  });

  it('should ask before leaving the page if there are unsaved changes after saving', async () => {
    renderHarvesting(stripes, sendCallout);

    await selectInterval('monthly');
    await userEvent.click(getSaveButton());
    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));

    await selectInterval('daily');
    await userEvent.click(screen.getByRole('link', { name: 'Leave page' }));

    const dialog = await screen.findByRole('dialog', { name: 'There are unsaved changes' });
    expect(within(dialog).getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should show an error callout if saving fails', async () => {
    saveConfig = jest.fn().mockRejectedValue(new Error('save failed'));
    renderHarvesting(stripes, sendCallout);

    await selectInterval('monthly');
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Error: save failed' }));
  });

  it('should delete the configuration if periodic harvesting is disabled and saved', async () => {
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({
      type: 'success',
      message: 'Successfully deleted periodic harvesting config',
    }));
    expect(deleteConfig).toHaveBeenCalled();
    expect(saveConfig).not.toHaveBeenCalled();
    expect(await findEnableCheckbox()).not.toBeChecked();
    expect(getIntervalSelect()).toBeDisabled();
    expect(getIntervalSelect()).toHaveValue('');
    expect(screen.queryByText('October 7, 2026 8:00 AM')).not.toBeInTheDocument();
    expect(getSaveButton()).toBeDisabled();
  });

  it('should show an error callout if deleting fails', async () => {
    deleteConfig = jest.fn().mockRejectedValue(new Error('delete failed'));
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Error: delete failed' }));
  });

  it('should not delete anything if periodic harvesting is disabled and no configuration exists', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    const checkbox = await findEnableCheckbox();
    await userEvent.click(checkbox);
    await selectInterval('monthly');
    await userEvent.click(checkbox);
    await userEvent.click(getSaveButton());

    expect(deleteConfig).not.toHaveBeenCalled();
    expect(saveConfig).not.toHaveBeenCalled();
    expect(getSaveButton()).toBeDisabled();
  });
});
