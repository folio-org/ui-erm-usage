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
const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

describe('Harvesting', () => {
  const stripes = useStripes();
  const sendCallout = jest.fn();
  let fetchConfig;
  let saveConfig;
  usePeriodicConfig.mockImplementation(() => ({ fetchConfig, saveConfig }));

  beforeEach(() => {
    sendCallout.mockClear();
    fetchConfig = jest.fn().mockResolvedValue(periodicConfig);
    saveConfig = jest.fn().mockResolvedValue();
  });

  it('should show the fetched configuration', async () => {
    renderHarvesting(stripes, sendCallout);

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('10/14/2026'));
    expect(screen.getByRole('combobox', { name: 'Periodic interval' })).toHaveValue('weekly');
  });

  it('should show the current date and time if no configuration exists', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    const today = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    renderHarvesting(stripes, sendCallout);

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue(today));
    expect(screen.getByRole('textbox', { name: 'Start time' })).not.toHaveValue('');
  });

  it('should save the default interval (daily) if no configuration exists', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(saveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ periodicInterval: 'daily' })
    ));
  });

  it('should show an error callout if fetching fails', async () => {
    fetchConfig = jest.fn().mockRejectedValue(new Error('fetch failed'));
    renderHarvesting(stripes, sendCallout);

    expect(await findEnableCheckbox()).toBeInTheDocument();
    expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Error: fetch failed' });
  });

  it('should disable the save button again if periodic harvesting is enabled and disabled', async () => {
    renderHarvesting(stripes, sendCallout);

    const checkbox = await findEnableCheckbox();
    await userEvent.click(checkbox);
    await userEvent.click(checkbox);

    expect(getSaveButton()).toBeDisabled();
  });

  it('should save the configuration without the non-persisted enablePeriodic flag', async () => {
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Periodic interval' }), 'monthly');
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));
    expect(saveConfig).toHaveBeenCalledWith({ startAt: '2026-10-14T08:00:00+0000', periodicInterval: 'monthly' });
  });

  it('should keep showing the last triggered date after saving', async () => {
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());
    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));

    expect(screen.getByText('October 7, 2026 8:00 AM')).toBeInTheDocument();
  });

  it('should ask before leaving the page if there are unsaved changes after saving', async () => {
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());
    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' })));

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(screen.getByRole('link', { name: 'Leave page' }));

    const dialog = await screen.findByRole('dialog', { name: 'There are unsaved changes' });
    expect(within(dialog).getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should show an error callout if saving fails', async () => {
    saveConfig = jest.fn().mockRejectedValue(new Error('save failed'));
    renderHarvesting(stripes, sendCallout);

    await userEvent.click(await findEnableCheckbox());
    await userEvent.click(getSaveButton());

    await waitFor(() => expect(sendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Error: save failed' }));
  });
});
