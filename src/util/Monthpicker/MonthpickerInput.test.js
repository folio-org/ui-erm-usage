import {
  fireEvent,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  HasCommand,
  StripesOverlayWrapper,
} from '@folio/stripes/components';

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

const renderMonthpickerInputWithParentHasCommand = (parentEscHandler) => {
  return renderWithIntl(
    <HasCommand
      commands={[
        {
          name: 'close',
          handler: parentEscHandler,
          shortcut: 'esc',
        },
      ]}
      scope={document.body}
    >
      <div>
        <MonthpickerInput {...defaultProps} />
      </div>
    </HasCommand>
  );
};

const pressEscapeKey = (element) => {
  // keyboardjs from stripes-react-hotkeys uses keyCode to identify keys
  fireEvent.keyDown(element, { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 });
  fireEvent.keyUp(element, { key: 'Escape', code: 'Escape', keyCode: 27, which: 27 });
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

  it('should trap focus within calendar', async () => {
    renderMonthpickerInput();

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    const yearInput = screen.getByRole('spinbutton', { name: 'year' });
    await waitFor(() => {
      expect(yearInput).toHaveFocus();
    });

    await userEvent.tab({ shift: true });

    const monthButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.length === 3);
    const lastMonthButton = monthButtons[monthButtons.length - 1];

    await waitFor(() => {
      expect(lastMonthButton).toHaveFocus();
    });

    await userEvent.tab();

    await waitFor(() => {
      expect(yearInput).toHaveFocus();
    });
  });

  describe('ESC key handling', () => {
    it('should close calendar when ESC pressed on month button', async () => {
      renderMonthpickerInput();

      await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const monthButton = screen.getAllByRole('button').find(btn => btn.textContent === 'May');
      monthButton.focus();

      pressEscapeKey(monthButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close calendar when ESC pressed on year input', async () => {
      renderMonthpickerInput();

      await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const yearInput = screen.getByRole('spinbutton', { name: 'year' });
      yearInput.focus();

      pressEscapeKey(yearInput);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should not propagate ESC to parent when closing calendar', async () => {
      const parentEscHandler = jest.fn();
      renderMonthpickerInputWithParentHasCommand(parentEscHandler);

      await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const monthButton = screen.getAllByRole('button').find(btn => btn.textContent === 'May');
      monthButton.focus();

      pressEscapeKey(monthButton);

      // Calendar should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Parent's ESC handler should NOT be called (event propagation was stopped)
      expect(parentEscHandler).not.toHaveBeenCalled();
    });

    it('should propagate ESC to parent when calendar is closed', async () => {
      const parentEscHandler = jest.fn();
      renderMonthpickerInputWithParentHasCommand(parentEscHandler);

      // Calendar is closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Focus the input field
      const input = screen.getByRole('textbox', { name: 'Year and month input' });
      input.focus();

      pressEscapeKey(input);

      // Parent's ESC handler SHOULD be called (calendar is closed, no stopPropagation)
      expect(parentEscHandler).toHaveBeenCalled();
    });
  });
});
