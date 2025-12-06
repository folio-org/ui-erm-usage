import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesOverlayWrapper } from '@folio/stripes/components';
import { act } from 'react';

import renderWithIntl from '../../../test/jest/helpers';
import MonthpickerInput from './MonthpickerInput';

// Capture onRootClose by wrapping the real RootCloseWrapper
let capturedOnRootClose = null;

jest.mock('@folio/stripes/components', () => {
  const actual = jest.requireActual('@folio/stripes/components');
  const React = jest.requireActual('react');
  const ActualRootCloseWrapper = actual.RootCloseWrapper;

  return {
    ...actual,
    RootCloseWrapper: React.forwardRef((props, ref) => {
      capturedOnRootClose = props.onRootClose;
      // Use the real RootCloseWrapper with all its actual behavior
      return <ActualRootCloseWrapper {...props} ref={ref} />;
    }),
  };
});

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

describe('MonthpickerInput', () => {
  it('should render input field with correct placeholder', () => {
    renderMonthpickerInput();

    expect(screen.getByRole('textbox', { name: 'Year and month input' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yyyy-MM')).toBeInTheDocument();
  });

  it('should display dialog if calendar icon is clicked', async () => {
    renderMonthpickerInput();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });
    await userEvent.click(toggleButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show all months as buttons', async () => {
    renderMonthpickerInput();
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    const buttons = screen.getAllByRole('button');
    const monthButtons = buttons.filter(btn => btn.textContent?.length === 3);
    expect(monthButtons).toHaveLength(12);
  });

  it('should call input.onChange if a month is selected', async () => {
    const onChange = jest.fn();
    renderMonthpickerInput({
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
    renderMonthpickerInput({
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

    renderMonthpickerInput({
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

  it('should work correctly in portal mode (usePortal: true)', async () => {
    const onChange = jest.fn();

    renderWithIntl(
      <StripesOverlayWrapper>
        <MonthpickerInput
          {...defaultProps}
          input={{
            name: 'test-monthpicker',
            value: '2023-01',
            onChange,
            onBlur: jest.fn(),
            onFocus: jest.fn(),
          }}
        />
      </StripesOverlayWrapper>
    );

    // Open calendar
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Select a month (clicking inside the portaled calendar should work)
    const juneButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Jun');
    await userEvent.click(juneButton);

    // Verify onChange was called with correct value
    expect(onChange).toHaveBeenCalledWith('2023-06');

    // Verify calendar closes after selection
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should toggle calendar on repeated icon clicks', async () => {
    renderMonthpickerInput();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });

    await userEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close calendar when clicking outside', async () => {
    renderMonthpickerInput();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });

    await userEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("RootCloseWrapper's onRootClose() should not close the calendar when toggle button is the click target", async () => {
    // Tests the fix for toggle button race condition (see UIEUS-491):
    // When the calendar is open, clicking the toggle button would trigger both RootCloseWrapper's
    // onRootClose AND toggle button's onClick, causing the calendar to stay open.
    // Can't reproduce this race condition in jsdom, so we directly call onRootClose to verify the
    // ref check prevents closing the calendar.

    renderMonthpickerInput();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });

    // Open calendar
    await userEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Directly call RootCloseWrapper's onRootClose with the toggle button as target
    // Use act() to flush setState calls synchronously before the assertion
    act(() => {
      capturedOnRootClose({ target: toggleButton });
    });

    // Calendar should still be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Normal toggle should still work, calendar should close
    await userEvent.click(toggleButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
