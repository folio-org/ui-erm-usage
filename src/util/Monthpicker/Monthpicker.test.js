import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../../../test/jest/helpers';
import Monthpicker from './Monthpicker';

const defaultProps = {
  input: {
    name: 'test-monthpicker',
    value: '',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
  },
  meta: {
    touched: false,
    error: '',
  },
  textLabel: 'Test label',
  isRequired: false,
  dateFormat: 'yyyy-MM',
};

const renderMonthpicker = (props = {}) => {
  return renderWithIntl(
    <Monthpicker {...defaultProps} {...props} />
  );
};

describe('Monthpicker', () => {
  it('should render input field with correct placeholder', () => {
    renderMonthpicker();

    expect(screen.getByRole('textbox', { name: 'Year and month input' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yyyy-MM')).toBeInTheDocument();
  });

  it('should display dialog if calendar icon is clicked', async () => {
    renderMonthpicker();

    const toggleButton = screen.getByRole('button', { name: /calendar/i });
    await userEvent.click(toggleButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should show all months as buttos', async () => {
    renderMonthpicker();
    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    const buttons = screen.getAllByRole('button');
    const monthButtons = buttons.filter(btn => btn.textContent?.length === 3);
    expect(monthButtons).toHaveLength(12);
  });

  it('should call input.onChange if a month is selected', async () => {
    const onChange = jest.fn();
    renderMonthpicker({
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
    renderMonthpicker({
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

    renderMonthpicker({
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

  it('should show error message if meta has an error and touched is true', () => {
    renderMonthpicker({
      meta: {
        touched: true,
        error: 'Invalid date',
      },
    });

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  describe('Monthpicker - input format + locale handling', () => {
    const inputs = [
      ['de-DE', '06.2000'],
      ['en-US', '06/2000'],
      ['zh-CN', '2000年06月'],
      ['de-DE', '2000-06'],
      ['de-DE', '13.2000'],     // ungültig
    ];

    const fallbackYear = new Date().getFullYear();

    test.each(inputs)(
      'should handle locale %s with value %s',
      async (locale, value) => {
        renderMonthpicker({
          input: {
            name: 'test-monthpicker',
            value,
            onChange: jest.fn(),
            onBlur: jest.fn(),
            onFocus: jest.fn(),
          },
          intl: { locale },
        });

        const input = screen.getByLabelText('Year and month input');

        expect(input).toBeInTheDocument();

        if (value === '13.2000') {
          // invalid date: fallback to current year and month
          expect(input).toHaveValue(value);

          await userEvent.click(screen.getByRole('button', { name: /calendar/i }));
          const yearInput = screen.getByRole('spinbutton', { name: 'year' });
          expect(yearInput.value).toBe(String(fallbackYear));
        } else {
          expect(input).toHaveValue(value);
        }
      }
    );
  });
});
