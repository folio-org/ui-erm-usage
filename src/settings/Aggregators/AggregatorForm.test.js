import { omit } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  StripesContext,
  useStripes,
} from '@folio/stripes/core';

import aggregatorTransformed from '../../../test/fixtures/aggregatorTransformed';
import renderWithIntl from '../../../test/jest/helpers';
import AggregatorForm from './AggregatorForm';
import '../../../test/jest/__mock__';

const aggregators = [
  {
    value: 'NSS',
    label: 'Nationaler Statistikserver',
  },
];

const onSubmit = jest.fn();
const onCancel = jest.fn();

const renderAggregratorForm = (stripes, initialValues = {}, aggregatorImpls = []) => {
  return renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <AggregatorForm
          aggregatorImpls={aggregatorImpls}
          aggregators={aggregators}
          initialValues={initialValues}
          onCancel={onCancel}
          onSubmit={onSubmit}
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

    const keyField = screen.getByLabelText(/Key/);
    await userEvent.type(keyField, 'key');

    const valueField = screen.getByLabelText(/Value/);
    await userEvent.type(valueField, 'val');
    expect(screen.getByText('Key')).toBeInTheDocument();

    const trashBtn = screen.getByRole('button', { name: 'Delete this item' });
    await userEvent.click(trashBtn);
    expect(screen.queryByText('Key')).not.toBeInTheDocument();
  });

  test('trims whitespace from service url', async () => {
    const serviceUrlInput = screen.getByRole('textbox', { name: /service url/i });
    await userEvent.click(serviceUrlInput);
    await userEvent.paste('  http://example.com/sushi   ');
    await userEvent.tab();

    expect(serviceUrlInput).toHaveValue('http://example.com/sushi');
  });
});

describe('Edit Aggregator', () => {
  let stripes;

  beforeEach(async () => {
    stripes = useStripes();
    renderAggregratorForm(stripes, aggregatorTransformed);
  });

  test('adding "config parameter" and entering values enables save button, ' +
    'removing "config parameter" disables save button', async () => {
    const saveButton = screen.getByRole('button', { name: 'Save & close' });
    expect(saveButton).toBeDisabled();

    const addConfigBtn = screen.getByRole('button', { name: 'Add config parameter' });
    await userEvent.click(addConfigBtn);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });

    const keyField = screen.getByLabelText(/Key/);
    await userEvent.type(keyField, 'key');

    const valueField = screen.getByLabelText(/Value/);
    await userEvent.type(valueField, 'val');

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

describe('AggregatorForm pane title', () => {
  let stripes;

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  test('create: renders "New aggregator"', () => {
    renderAggregratorForm(stripes);

    expect(screen.getByText('New aggregator')).toBeInTheDocument();
  });

  test('edit: renders the aggregator label', () => {
    renderAggregratorForm(stripes, aggregatorTransformed);

    expect(screen.getByText('Aggregator Test')).toBeInTheDocument();
  });

  test('duplicate: renders "New aggregator" as there is no id', () => {
    renderAggregratorForm(stripes, omit(aggregatorTransformed, 'id'));

    expect(screen.getByText('New aggregator')).toBeInTheDocument();
    expect(screen.queryByText('Aggregator Test')).not.toBeInTheDocument();
  });
});

describe('AggregatorForm unsupported service type', () => {
  let stripes;

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  test('edit: adds unsupported service type as selected option', () => {
    const unsupportedAggregator = { ...aggregatorTransformed, serviceType: 'TESTAGG' };
    renderAggregratorForm(stripes, unsupportedAggregator, [{ implementations: [{ type: 'NSS' }] }]);

    const serviceTypeSelect = screen.getByLabelText('Service type', { exact: false });
    expect(serviceTypeSelect).toHaveValue('TESTAGG');
    expect(within(serviceTypeSelect).getByRole('option', { name: 'TESTAGG (Unsupported)' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name', { exact: false })).toHaveValue('Aggregator Test');
    expect(screen.queryByText('Aggregator Test (Unsupported)')).not.toBeInTheDocument();
  });

  test('edit: does not add an unsupported option for a supported service type', () => {
    renderAggregratorForm(stripes, aggregatorTransformed, [{ implementations: [{ type: 'NSS' }] }]);

    const serviceTypeSelect = screen.getByLabelText('Service type', { exact: false });
    expect(serviceTypeSelect).toHaveValue('NSS');
    expect(within(serviceTypeSelect).queryByRole('option', { name: /\(Unsupported\)/ })).not.toBeInTheDocument();
  });
});
