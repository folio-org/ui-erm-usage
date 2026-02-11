import { MemoryRouter } from 'react-router-dom';

import { screen, within, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
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
const onCancel = jest.fn();

const renderAggregratorForm = (stripes, initialValues = {}) => {
  return renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <AggregatorForm
          aggregators={aggregators}
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValues={initialValues}
          onRemove={onRemove}
          stripes={stripes}
        />
      </StripesContext.Provider>
    </MemoryRouter>
  );
};

describe('AggregatorForm', () => {
  let stripes;

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
    renderAggregratorForm(stripes);
  });

  test('renders form', () => {
    expect(screen.getByText('Name')).toBeVisible();
  });

  test('Save & close is enabled and clicked', async () => {
    const saveButton = screen.getByRole('button', { name: 'Save & close' });
    expect(saveButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Name', { exact: false }), 'Agg Name');
    await userEvent.selectOptions(screen.getByLabelText('Service type', { exact: false }), ['NSS']);
    await userEvent.type(screen.getByLabelText('Service URL', { exact: false }), 'http://www.agg.com');
    await userEvent.selectOptions(screen.getByLabelText('Type*'), ['API']);

    expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);
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

describe('Edit Aggregator', () => {
  let stripes;

  beforeEach(async () => {
    stripes = useStripes();
    renderAggregratorForm(stripes, aggregator);
  });

  test('adding "config parameter" enables save button, removing "config parameter" disables save button', async () => {
    const saveButton = screen.getByRole('button', { name: 'Save & close' });
    expect(saveButton).toBeDisabled();

    const addConfigBtn = screen.getByRole('button', { name: 'Add config parameter' });
    await userEvent.click(addConfigBtn);

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    const deleteBtn = screen.getByRole('button', { name: 'Delete this item' });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
  });

  test('adding "contact" enables save button, removing "contact" disables save button', async () => {
    const saveButton = screen.getByRole('button', { name: 'Save & close' });
    expect(saveButton).toBeDisabled();

    const addContactBtn = screen.getByRole('button', { name: /Add contact/i });
    await userEvent.click(addContactBtn);

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    const deleteBtn = screen.getByRole('button', { name: 'Delete this item' });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
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
