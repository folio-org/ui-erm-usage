import { Form } from 'react-final-form';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import renderWithIntl from '../../../test/jest/helpers';
import UDPInfoForm from './UDPInfoForm';

const renderUDPInfoForm = (initialValues = {}) => renderWithIntl(
  <Form
    initialValues={initialValues}
    onSubmit={jest.fn()}
    render={({ form, values }) => (
      <UDPInfoForm
        accordionId="udpInfo"
        expanded
        form={form}
        values={values}
      />
    )}
  />
);

describe('UDPInfoForm component', () => {
  it('should render description as textarea', () => {
    renderUDPInfoForm();
    expect(screen.getByRole('textbox', { name: 'Description' }).tagName).toBe('TEXTAREA');
  });

  it('should keep line breaks in description', () => {
    renderUDPInfoForm({ description: 'first line\nsecond line' });
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue('first line\nsecond line');
  });
});
