import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { useStripes } from '@folio/stripes/core';
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
    beforeEach(() => {
      userEvent.type(
        screen.getByLabelText('Name', { exact: false }),
        'Agg Name'
      );
      userEvent.selectOptions(
        screen.getByLabelText('Service type', { exact: false }),
        ['NSS']
      );
      userEvent.type(
        screen.getByLabelText('Service URL', { exact: false }),
        'http://www.agg.com'
      );
      userEvent.selectOptions(screen.getByLabelText('Type*'), ['API']);
    });

    test('Save & close is clicked', () => {
      userEvent.click(screen.getByText('Save & close'));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('test aggregator configuration', () => {
    beforeEach(() => {
      const addBtn = screen.getByRole('button', {
        name: 'Add config parameter',
      });
      userEvent.click(addBtn);
    });

    test('can change config parameters', async () => {
      const keyField = screen.getByLabelText('Key');
      userEvent.type(keyField, 'key');

      const valueField = screen.getByLabelText('Value');
      userEvent.type(valueField, 'val');

      const trashBtn = screen.getByRole('button', {
        name: 'Delete this item',
      });
      await userEvent.click(trashBtn);
      expect(screen.queryByText('Key')).not.toBeInTheDocument();
    });
  });
});

describe('Delete Aggregator', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderAggregratorForm(stripes, aggregator);

    const deleteBtn = screen.getByRole('button', {
      name: 'Delete',
    });
    userEvent.click(deleteBtn);
  });

  test('click cancel', async () => {
    const cancelBtn = screen.getByRole('button', {
      name: 'Cancel',
      id: 'clickable-deleteaggregator-confirmation-cancel',
    });
    await userEvent.click(cancelBtn);
    await waitForElementToBeRemoved(() => screen.getByText('Delete aggregator'));
  });

  test('click submit', async () => {
    const submitBtn = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitBtn);
    expect(onRemove).toHaveBeenCalled();
  });
});
