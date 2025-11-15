import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import StripesOverlayWrapper from '@folio/stripes-components/util/StripesOverlayWrapper';
import { OVERLAY_CONTAINER_ID } from '@folio/stripes-components/util/consts';

import renderWithIntl from '../../../test/jest/helpers';
import MonthpickerInput from './MonthpickerInput';

const defaultProps = {
  input: {
    name: 'test-monthpicker-input',
    value: '2023-01',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
  },
  meta: {
    touched: false,
    error: '',
  },
  textLabel: 'Test label',
  isRequired: true,
  dateFormat: 'yyyy-MM',
  backendDateFormat: 'yyyy-MM',
};

const renderMonthpickerInput = (props = {}, locale) => {
  return renderWithIntl(
    <MonthpickerInput {...defaultProps} {...props} />,
    undefined,
    locale,
  );
};

const renderMonthpickerInputWithPortal = (props = {}, locale) => {
  return renderWithIntl(
    <StripesOverlayWrapper>
      <MonthpickerInput {...defaultProps} {...props} />
    </StripesOverlayWrapper>,
    undefined,
    locale,
  );
};

// Helper to create a portal container like Stripes does in FOLIO reference environments
const setupPortalContainer = () => {
  const portalContainer = document.createElement('div');
  portalContainer.setAttribute('id', OVERLAY_CONTAINER_ID);
  document.body.appendChild(portalContainer);
  return portalContainer;
};

const cleanupPortalContainer = () => {
  const container = document.getElementById(OVERLAY_CONTAINER_ID);
  if (container) {
    document.body.removeChild(container);
  }
};

// Shared test suite that runs in both environments
const sharedTests = (renderFn) => {
  it('should render input field with correct placeholder', () => {
    renderFn();

    expect(screen.getByRole('textbox', { name: 'Year and month input' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yyyy-MM')).toBeInTheDocument();
  });

  it('should display dialog if calendar icon is clicked', async () => {
    renderFn();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });
    await userEvent.click(toggleButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show all months as buttons', async () => {
    renderFn();
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    const buttons = screen.getAllByRole('button');
    const monthButtons = buttons.filter(btn => btn.textContent?.length === 3);
    expect(monthButtons).toHaveLength(12);
  });

  it('should call input.onChange if a month is selected', async () => {
    const onChange = jest.fn();
    renderFn({
      input: {
        name: 'test-monthpicker',
        value: '2023-01',
        onChange,
        onBlur: jest.fn(),
        onFocus: jest.fn(),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    const mayButton = screen.getAllByRole('button').find(btn => btn.textContent === 'May');
    await userEvent.click(mayButton);

    expect(onChange).toHaveBeenCalledWith('2023-05');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should change year via input', async () => {
    renderFn({
      input: {
        name: 'test-monthpicker',
        value: '2023-06',
        onChange: jest.fn(),
        onBlur: jest.fn(),
        onFocus: jest.fn(),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    // use spinbutton for input with type="number"
    const yearInput = screen.getByRole('spinbutton', { name: 'year' });
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, '2025');

    expect(yearInput.value).toBe('2025');
  });

  it('should increment and decrement year', async () => {
    const onChange = jest.fn();

    renderFn({
      input: {
        name: 'test-monthpicker',
        value: '2023-04',
        onChange,
        onBlur: jest.fn(),
        onFocus: jest.fn(),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    // use spinbutton for input with type="number"
    const yearInput = screen.getByRole('spinbutton', { name: 'year' });
    expect(yearInput.value).toBe('2023');

    const nextYearBtn = screen.getByRole('button', { name: 'Go to next year' });
    const prevYearBtn = screen.getByRole('button', { name: 'Go to previous year' });

    await userEvent.click(nextYearBtn);
    expect(onChange).toHaveBeenCalledWith('2024-04');

    await userEvent.click(prevYearBtn);
    expect(onChange).toHaveBeenCalledWith('2023-04');
  });
};

describe('MonthpickerInput', () => {
  describe('without portal (inline rendering)', () => {
    sharedTests(renderMonthpickerInput);
  });

  describe('with portal (FOLIO reference environments)', () => {
    beforeEach(() => {
      setupPortalContainer();
    });

    afterEach(() => {
      cleanupPortalContainer();
    });

    sharedTests(renderMonthpickerInputWithPortal);
  });
});
