import { CalloutContext, StripesContext, useStripes } from '@folio/stripes/core';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import PeriodicHarvestingManager from './PeriodicHarvestingManager';
import usePeriodicConfig from '../../util/hooks/usePeriodicConfig';

jest.mock('../../util/hooks/usePeriodicConfig');
jest.mock('./PeriodicHarvestingView', () => () => <div>PeriodicHarvestingView</div>);

const render = (stripes, sendCallout) => {
  return renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <CalloutContext.Provider value={{ sendCallout }}>
          <PeriodicHarvestingManager />
        </CalloutContext.Provider>
      </StripesContext.Provider>
    </MemoryRouter>
  );
};

describe('PeriodicHarvestingManager', () => {
  const stripes = useStripes();
  const sendCalloutMock = jest.fn();
  let fetchConfig;
  let saveConfig;
  let deleteConfig;
  usePeriodicConfig.mockImplementation(() => ({ fetchConfig, saveConfig, deleteConfig }));

  it('renders correctly if fetch succeeds', async () => {
    fetchConfig = jest
      .fn()
      .mockResolvedValue({ startAt: '2023-07-05T12:00:00.000+0000', periodicInterval: 'daily' });
    render(stripes, sendCalloutMock);

    await screen.findByText('PeriodicHarvestingView');
    expect(screen.getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('icon', 'edit');
    expect(fetchConfig).toHaveBeenCalled();
  });

  it('renders correctly if fetch returns empty object', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    render(stripes, sendCalloutMock);

    await screen.findByText('PeriodicHarvestingView');
    expect(screen.getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('icon', 'plus-sign');
    expect(fetchConfig).toHaveBeenCalled();
  });

  it('renders correctly if fetch fails', async () => {
    fetchConfig = jest.fn().mockRejectedValue(new Error('fetch failed'));
    render(stripes, sendCalloutMock);

    await screen.findByText('PeriodicHarvestingView');
    expect(screen.getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('icon', 'plus-sign');
    expect(fetchConfig).toHaveBeenCalled();
    expect(sendCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error: fetch failed',
    });
  });

  it('renders correctly if save fails / save succeeds on edit', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    saveConfig = jest
      .fn()
      .mockRejectedValueOnce(new Error('failed to save'))
      .mockResolvedValue({ status: 201 });
    render(stripes, sendCalloutMock);

    await userEvent.click(screen.getByRole('button', { name: /config/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveConfig).toHaveBeenCalledTimes(1);
    expect(sendCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error: failed to save',
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(fetchConfig).toHaveBeenCalledTimes(1);
    expect(saveConfig).toHaveBeenCalledTimes(2);
    expect(sendCalloutMock).toHaveBeenCalledWith({
      type: 'success',
      message: 'Successfully saved periodic harvesting config',
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'edit');
    });
  });

  it('renders correctly if delete fails / delete succeeds on edit', async () => {
    fetchConfig = jest
      .fn()
      .mockResolvedValue({ startAt: '2023-07-05T12:00:00.000+0000', periodicInterval: 'daily' });
    deleteConfig = jest
      .fn()
      .mockRejectedValueOnce(new Error('failed to delete'))
      .mockResolvedValue({ status: 204 });
    render(stripes, sendCalloutMock);

    // click edit
    await userEvent.click(screen.getByRole('button', { name: /config/i }));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();

    // click delete fails
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(deleteConfig).toHaveBeenCalledTimes(1);
    expect(sendCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error: failed to delete',
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    // click delete succeeds
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(fetchConfig).toHaveBeenCalledTimes(1);
    expect(deleteConfig).toHaveBeenCalledTimes(2);
    expect(sendCalloutMock).toHaveBeenCalledWith({
      type: 'success',
      message: 'Successfully deleted periodic harvesting config',
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'plus-sign');
    });
  });

  it('ConfirmationModal works correctly on edit', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    render(stripes, sendCalloutMock);

    // click edit
    await userEvent.click(screen.getByRole('button', { name: /config/i }));
    expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');

    // click cancel
    await userEvent.click(screen.getByRole('button', { name: /config/i }));
    expect(screen.getByRole('heading', { name: 'Please confirm!' })).toBeVisible();

    // click keep editing
    await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    // click cancel again
    await userEvent.click(screen.getByRole('button', { name: /config/i }));
    expect(screen.getByRole('heading', { name: 'Please confirm!' })).toBeVisible();

    // click close
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'plus-sign');
    });
  });
});
