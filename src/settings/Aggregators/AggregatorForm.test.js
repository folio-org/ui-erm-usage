import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StripesContext, useStripes } from '@folio/stripes/core';
import renderWithIntl from '../../../test/jest/helpers';
import AggregatorForm from './AggregatorForm';
import aggregator from '../../../test/fixtures/aggregator';

import '../../../test/jest/__mock__';

const aggregators = [
  {
    value: 'NSS',
    label: 'Nationaler Statistikserver',
  },
];
const onSubmit = jest.fn();
const onRemove = jest.fn();
const renderAggregratorForm = (stripes, initialValues = {}) => {
  return renderWithIntl(
    <Provider store={createStore(() => {})}>
      <MemoryRouter>
        <StripesContext.Provider value={stripes}>
          <Form
            onSubmit={jest.fn}
            render={() => (
              <AggregatorForm
                aggregators={aggregators}
                handleSubmit={onSubmit}
                initialValues={initialValues}
                onRemove={onRemove}
                store={stripes.store}
                stripes={stripes}
              />
            )}
          />
        </StripesContext.Provider>
      </MemoryRouter>
    </Provider>
  );
};

describe('AggregatorForm', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderAggregratorForm(stripes);
  });

  test('renders form', () => {
    expect(screen.getByText('Name')).toBeVisible();
  });

  describe('test happy path with save', () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByLabelText('Name', { exact: false }), 'Agg Name');
      await userEvent.selectOptions(screen.getByLabelText('Service type', { exact: false }), ['NSS']);
      await userEvent.type(screen.getByLabelText('Service URL', { exact: false }), 'http://www.agg.com');
      await userEvent.selectOptions(screen.getByLabelText('Type*'), ['API']);
    });

    test('Save & close is clicked', async () => {
      await userEvent.click(screen.getByText('Save & close'));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('test aggregator configuration', () => {
    beforeEach(async () => {
      const addBtn = screen.getByRole('button', {
        name: 'Add config parameter',
      });
      await userEvent.click(addBtn);
    });

    test('can change config parameters', async () => {
      const keyField = screen.getByLabelText('Key');
      await userEvent.type(keyField, 'key');

      const valueField = screen.getByLabelText('Value');
      await userEvent.type(valueField, 'val');
      expect(screen.getByText('Key')).toBeInTheDocument();

      const trashBtn = screen.getByRole('button', { name: 'Delete this item' });
      await userEvent.click(trashBtn);
      expect(screen.queryByText('Key')).not.toBeInTheDocument();
    });
  });
});

describe('Delete Aggregator', () => {
  let stripes;

  beforeEach(async () => {
    stripes = useStripes();
    renderAggregratorForm(stripes, aggregator);

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteBtn);
  });

  test('click cancel', async () => {
    const deleteModalText = screen.getByRole('heading', { name: 'Delete aggregator' });
    expect(deleteModalText).toBeInTheDocument();

    const cancelButton = document.querySelector('#clickable-deleteaggregator-confirmation-cancel');
    await userEvent.click(cancelButton);
    expect(deleteModalText).not.toBeInTheDocument();
  });

  test('click submit', async () => {
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitBtn);
    expect(onRemove).toHaveBeenCalled();
  });
});
