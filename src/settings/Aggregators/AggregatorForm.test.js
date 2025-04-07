import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
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

const store = createStore(
  combineReducers({
    form: reducer,
  })
);

const onSubmit = jest.fn();
const onRemove = jest.fn();

const renderAggregratorForm = (stripes, initialValues = {}) => {
  return renderWithIntl(
    <Provider store={store}>
      <MemoryRouter>
        <StripesContext.Provider value={stripes}>
          <AggregatorForm
            aggregators={aggregators}
            onSave={onSubmit}
            initialValues={initialValues}
            onRemove={onRemove}
            stripes={stripes}
          />
        </StripesContext.Provider>
      </MemoryRouter>
    </Provider>
  );
};

describe('AggregatorForm', () => {
  let stripes;

  beforeEach(() => {
    onSubmit.mockClear();
    stripes = useStripes();
    renderAggregratorForm(stripes);
  });

  test('renders form', () => {
    expect(screen.getByText('Name')).toBeVisible();
  });

  test('Save & close is enabled and clicked', async () => {
    await userEvent.type(screen.getByLabelText('Name', { exact: false }), 'Agg Name');
    await userEvent.selectOptions(screen.getByLabelText('Service type', { exact: false }), ['NSS']);
    await userEvent.type(screen.getByLabelText('Service URL', { exact: false }), 'http://www.agg.com');
    await userEvent.selectOptions(screen.getByLabelText('Type*'), ['API']);

    expect(screen.getByRole('button', { name: 'Save & close' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  test('can change aggregator configuration parameters', async () => {
    const addBtn = screen.getByRole('button', { name: 'Add config parameter' });
    await userEvent.click(addBtn);

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

    const deleteModal = screen.getByRole('dialog', { name: /Do you really want to delete/ });
    expect(deleteModal).toBeVisible();

    const cancelButton = within(deleteModal).getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);
    expect(deleteModalText).not.toBeInTheDocument();
  });

  test('click submit', async () => {
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitBtn);
    expect(onRemove).toHaveBeenCalled();
  });
});
