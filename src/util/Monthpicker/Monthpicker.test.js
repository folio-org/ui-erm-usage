import { Form } from 'react-final-form';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  screen,
  waitFor,
 } from '@folio/jest-config-stripes/testing-library/react';

import renderWithIntl from '../../../test/jest/helpers';
import Monthpicker from './Monthpicker';

const renderMonthpicker = (props = {}, locale) => {
  return renderWithIntl(
     <Form
      onSubmit={jest.fn()}
      initialValues={{
        [props.name || 'test-monthpicker']: props.value || '',
      }}
      render={() => (
        <Monthpicker
          name="test-monthpicker"
          textLabel="Test label"
          {...props}
        />
      )}
    />,
    undefined,
    locale,
  );
};

describe('Monthpicker', () => {
  it('should show an alert if meta has an error and touched is true', async () => {
    renderMonthpicker({
      isRequired: true,
    });

    const input = screen.getByLabelText('Year and month input');

    // focus and blur to trigger validation
    await userEvent.click(input);
    await userEvent.tab();  

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Monthpicker - check input and format', () => {
    const cases = [
      // locale, backendFormat, displayFormat, backendValue, expectedDisplayValue
      ['de-DE', undefined, undefined, '2000-06', '06.2000'],
      ['de-DE', 'MM-yyyy', undefined, '06-2000', '06.2000'],
      ['de-DE', undefined, 'MM-yyyy', '2000-06', '06-2000'],
      ['de-DE', undefined, 'YYYY-mm', '2000-06', '2000-06'],
      ['de-DE', 'yyyy-MM', 'yyyy-MM', '2000-06', '2000-06'],
      ['de-DE', 'yyyy-MM', 'MM.yyyy', '2000-06', '06.2000'],
      ['en-US', undefined, undefined, '2000-06', '06/2000'],
      ['en-US', 'MM-yyyy', undefined, '06-2000', '06/2000'],
      ['nl-NL', undefined, undefined, '2000-06', '06-2000'],
      ['nl-NL', 'MM-yyyy', undefined, '06-2000', '06-2000'],
    ];

    test.each(cases)('should display correct formatted value for locale %s, backendFormat %s, displayFormat %s',
      async (locale, backendFormat, displayFormat, backendValue, expectedDisplayValue) => {
        renderMonthpicker(
          {
            backendDateFormat: backendFormat,
            dateFormat: displayFormat,
            value: backendValue,
            name: 'test-monthpicker',
          },
          locale,
        );

        const input = screen.getByLabelText('Year and month input');
        expect(input).toBeInTheDocument();
        
        await waitFor(() => {
          expect(input).toHaveValue(expectedDisplayValue);
        });
      });
  });

  describe('Monthpicker - check input for invalid values', () => {
    const invalidInputs = [
      // locale, backendFormat, displayFormat, backendValue
      ['de-DE', 'yyyy-MM', undefined, 'aa.bbbb'],
      ['de-DE', 'MM-yyyy', undefined, '06-20'],
      ['de-DE', 'MM-yyyy', 'MM.YYYY', '2000-06'],
    ];

    const fallbackYear = new Date().getFullYear();

    test.each(invalidInputs)('should fallback to current year',
      async (locale, backendFormat, displayFormat, backendValue) => {
        renderMonthpicker(
          {
            backendDateFormat: backendFormat,
            dateFormat: displayFormat,
            value: backendValue,
            name: 'test-monthpicker',
          },
          locale,
        );

        // invalid date: fallback to current year and month
        await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

        await waitFor(() => {
          const yearInput = screen.getByRole('spinbutton', { name: 'year' });
          expect(yearInput.value).toBe(String(fallbackYear));
        });
      });
  });
});
