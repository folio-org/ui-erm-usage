import { CalloutContext, StripesContext, useStripes } from '@folio/stripes/core';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const { getByText, getByRole } = render(stripes, sendCalloutMock);

    await waitFor(() => {
      expect(fetchConfig).toHaveBeenCalled();
      expect(getByText('PeriodicHarvestingView')).toBeInTheDocument();
      expect(getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
      expect(getByRole('button')).toHaveAttribute('icon', 'edit');
    });
  });

  it('renders correctly if fetch returns empty object', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    const { getByText, getByRole } = render(stripes, sendCalloutMock);

    await waitFor(() => {
      expect(fetchConfig).toHaveBeenCalled();
      expect(getByText('PeriodicHarvestingView')).toBeInTheDocument();
      expect(getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
      expect(getByRole('button')).toHaveAttribute('icon', 'plus-sign');
    });
  });

  it('renders correctly if fetch fails', async () => {
    fetchConfig = jest.fn().mockRejectedValue(new Error('fetch failed'));
    const { getByText, getByRole } = render(stripes, sendCalloutMock);

    await waitFor(() => {
      expect(fetchConfig).toHaveBeenCalled();
      expect(sendCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'Error: fetch failed',
      });
      expect(getByText('PeriodicHarvestingView')).toBeInTheDocument();
      expect(getByRole('heading', { name: 'Periodic harvesting' })).toBeInTheDocument();
      expect(getByRole('button')).toHaveAttribute('icon', 'plus-sign');
    });
  });

  it('renders correctly if save fails / save succeeds on edit', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    saveConfig = jest
      .fn()
      .mockRejectedValueOnce(new Error('failed to save'))
      .mockResolvedValue({ status: 201 });
    const { getByRole } = render(stripes, sendCalloutMock);

    userEvent.click(getByRole('button', { name: /config/i }));
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(saveConfig).toHaveBeenCalledTimes(1);
      expect(sendCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'Error: failed to save',
      });
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(fetchConfig).toHaveBeenCalledTimes(1);
      expect(saveConfig).toHaveBeenCalledTimes(2);
      expect(sendCalloutMock).toHaveBeenCalledWith({
        type: 'success',
        message: 'Successfully saved periodic harvesting config',
      });
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'edit');
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
    const { getByRole } = render(stripes, sendCalloutMock);

    // click edit
    userEvent.click(getByRole('button', { name: /config/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    // click delete fails
    userEvent.click(getByRole('button', { name: 'Delete' }));
    userEvent.click(getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(deleteConfig).toHaveBeenCalledTimes(1);
      expect(sendCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        message: 'Error: failed to delete',
      });
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    // click delete succeeds
    userEvent.click(getByRole('button', { name: 'Delete' }));
    userEvent.click(getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(fetchConfig).toHaveBeenCalledTimes(1);
      expect(deleteConfig).toHaveBeenCalledTimes(2);
      expect(sendCalloutMock).toHaveBeenCalledWith({
        type: 'success',
        message: 'Successfully deleted periodic harvesting config',
      });
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'plus-sign');
    });
  });

  it('ConfirmationModal works correctly on edit', async () => {
    fetchConfig = jest.fn().mockResolvedValue({});
    const { getByRole } = render(stripes, sendCalloutMock);

    // click edit
    userEvent.click(getByRole('button', { name: /config/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    // click cancel
    userEvent.click(getByRole('button', { name: /config/i }));
    expect(getByRole('heading', { name: 'Please confirm!' })).toBeVisible();

    // click keep editing
    userEvent.click(getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => {
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'times');
    });

    // click cancel again
    userEvent.click(getByRole('button', { name: /config/i }));
    expect(getByRole('heading', { name: 'Please confirm!' })).toBeVisible();

    // click close
    userEvent.click(getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /config/i })).toHaveAttribute('icon', 'plus-sign');
    });
  });
});
