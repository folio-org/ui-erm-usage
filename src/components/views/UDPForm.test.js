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

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import UDPForm from './UDPForm';

const stubAggregators = [
  {
    aggregatorSettings: [
      {
        id: '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
        label: 'German National Statistics Server',
        serviceUrl: 'https://sushi.url-to-nss.de/Sushiservice/GetReport',
        serviceType: 'NSS',
        accountConfig: {
          configMail: 'accounts@example.org',
          configType: 'Mail',
          displayContact: ['John Doe, Phone +49 0000 0000000 '],
        },
        aggregatorConfig: {
          apiKey: 'xxx',
          customerId: 'xxx',
          requestorId: 'xxx',
        },
      },
    ],
  },
];

const stubHarvesterImpls = [
  {
    implementations: [
      {
        type: 'cs41',
        name: 'Counter-Sushi 4.1',
        reportRelease: '4',
        supportedReports: [
          'BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR7',
          'DB1', 'DB2',
          'JR1', 'JR1 GOA', 'JR1a', 'JR2', 'JR3', 'JR3 Mobile', 'JR4', 'JR5',
          'MR1', 'MR1 Mobile',
          'PR1',
          'TR1', 'TR2', 'TR3', 'TR3 Mobile',
        ],
      },
      {
        type: 'cs50',
        name: 'Counter 5.0',
        reportRelease: '5',
        supportedReports: ['DR', 'IR', 'PR', 'TR'],
      },
      {
        type: 'cs51',
        name: 'Counter 5.1',
        reportRelease: '5.1',
        supportedReports: ['DR', 'IR', 'PR', 'TR'],
        isDefault: true,
      },
    ],
  },
];

const initialUdp = {
  id: '0ba00047-b6cb-417a-a735-e2c1e45e30f1',
  label: 'Usage data provider',
  status: 'active',
  harvestingConfig: {
    harvestingStatus: 'active',
    harvestVia: 'sushi',
    sushiConfig: {
      serviceType: 'cs41',
      serviceUrl: 'http://usage.udp.com/SushiServer',
    },
    reportRelease: '4',
    requestedReports: ['DR1'],
    harvestingStart: '2018-01',
  },
  sushiCredentials: {
    customerId: '0000000000',
    requestorId: '00000000-0000-0000-0000-000000000000',
    requestorName: 'Opentown Libraries',
    requestorMail: 'electronic@lib.optentown.edu',
  },
  notes:
    'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
};

const initialValues = {
  status: 'active',
  harvestingConfig: {
    harvestingStatus: 'active',
    harvestVia: 'sushi',
    reportRelease: '5.1',
    sushiConfig: { serviceType: 'cs51' },
  },
};

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderUDPForm = (stripes, udp = initialValues) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <UDPForm
          data={{
            aggregators: stubAggregators,
            harvesterImpls: stubHarvesterImpls,
          }}
          handlers={{ onClose, onDelete }}
          handleSubmit={handleSubmit}
          initialValues={udp}
          onSubmit={onSubmit}
          store={stripes.store}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('UDPForm', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();
    jest.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('should render form and service url with info button', async () => {
    renderUDPForm(stripes);
    expect(screen.getByText('Harvesting status')).toBeVisible();

    expect(screen.getByRole('textbox', { name: /service url/i })).toBeInTheDocument();
    const serviceUrlLabel = document.querySelector('label[for="addudp_serviceurl"]');

    expect(serviceUrlLabel).toBeInTheDocument();
    expect(within(serviceUrlLabel).getByRole('button', { name: 'info' })).toBeInTheDocument();
  });

  describe('test create new UDP', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderUDPForm(stripes);
    });

    test('check initial values', async () => {
      const providerStatusCombobox = screen.getByRole('combobox', { name: 'Provider status' });
      const harvestingStatusCombobox = screen.getByRole('combobox', { name: 'Harvesting status' });
      const serviceTypeCombobox = screen.getByRole('combobox', { name: 'Service type' });

      expect(providerStatusCombobox).toHaveValue('active');
      expect(harvestingStatusCombobox).toHaveValue('active');
      expect(serviceTypeCombobox).toHaveValue('cs51');
    });
  });

  describe('test harvestVia options', () => {
    beforeEach(async () => {
      renderUDPForm(stripes);

      const harvestingStatusSelect = screen.getByRole('combobox', { name: /harvesting status/i });

      await waitFor(() => expect(harvestingStatusSelect).toBeInTheDocument());

      await userEvent.selectOptions(harvestingStatusSelect, 'active');
    });

    test('should enable aggregator options', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);

      expect(screen.getByRole('combobox', { name: 'Aggregator' })).toBeEnabled();
      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeDisabled();
    });

    test('should enable sushi options', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['sushi']);

      expect(screen.getByRole('combobox', { name: 'Aggregator' })).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeEnabled();
    });
  });

  describe('test service type and selected reports options', () => {
    beforeEach(() => {
      renderUDPForm(stripes, {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const testSwitchFromCounterRelease4To5 = async (serviceType) => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['sushi']);
      expect(screen.getByRole('option', { name: 'Counter-Sushi 4.1' })).toBeInTheDocument();
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), ['Counter-Sushi 4.1']);
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: /Report type/ });
      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);

      await userEvent.click(screen.getByRole('option', { name: /BR1/ }));
      expect(screen.getByLabelText('BR1')).toBeInTheDocument();

      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), [serviceType]);
      expect(screen.getByRole('heading', { name: 'Clear report selection' })).toBeVisible();

      await userEvent.click(screen.getByRole('button', { name: 'Clear reports' }));
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButtonNew = screen.getByRole('button', { name: 'Report type' });
      expect(reportTypeButtonNew).toBeInTheDocument();
      await userEvent.click(reportTypeButtonNew);
      expect(screen.getByRole('option', { name: /DR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /IR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /PR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /TR/ })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('option', { name: /PR/ }));
      expect(screen.getByLabelText('PR')).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: /BR1/ })).not.toBeInTheDocument();
      expect(screen.queryByLabelText('BR1')).not.toBeInTheDocument();
    };

    test('select service type 5', async () => {
      await testSwitchFromCounterRelease4To5('Counter 5.0');
    }, 10000);

    test('select service type 5.1', async () => {
      await testSwitchFromCounterRelease4To5('Counter 5.1');
    }, 10000);
  });

  describe('test harvesting start and end', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting start valid format', async () => {
      const startInput = screen.getByLabelText(/Harvesting start/i);
      await userEvent.type(startInput, '01/2020');
      await userEvent.tab();
      expect(screen.queryByText('Date invalid', { exact: false })).not.toBeInTheDocument();
    });

    test('harvesting start > end is invalid', async () => {
      const startInput = screen.getByLabelText(/Harvesting start/i);
      await userEvent.type(startInput, '02/2020');

      const endInput = screen.getByLabelText(/Harvesting end/i);
      await userEvent.type(endInput, '01/2020');
      await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));
      expect(screen.getByText('End date must be greater than start date', { exact: false })).toBeInTheDocument();
    });
  });

  describe('test fill form', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('happy path', async () => {
      await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), 'FooBar');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /provider status/i }), 'active');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), ['Counter-Sushi 4.1']);
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: /aggregator/i }), ['5b6ba83e-d7e5-414e-ba7b-134749c0d950']
      );
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: 'Report type' });

      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);
      await userEvent.click(await screen.findByText('BR1'));

      await userEvent.type(screen.getByLabelText(/Harvesting start/i), '01/2020');

      await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('test delete UDP', () => {
    beforeEach(() => {
      renderUDPForm(stripes, initialUdp);
    });

    test('delete modal is shown', async () => {
      await userEvent.click(await screen.findByText('Delete'));
      expect(screen.getByRole('heading', { name: /Delete usage data Provider/ })).toBeInTheDocument();
    });

    test('click cancel delete', async () => {
      await userEvent.click(await screen.findByText('Delete'));

      const deleteModal = screen.getByRole('dialog', { name: /Do you really want to delete/ });
      expect(deleteModal).toBeVisible();

      const deleteModalText = within(deleteModal).getByRole('heading', { name: 'Delete usage data Provider' });
      expect(deleteModalText).toBeInTheDocument();

      const cancelButton = within(deleteModal).getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      expect(deleteModalText).not.toBeInTheDocument();
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit delete', async () => {
      await userEvent.click(await screen.findByText('Delete'));
      const submit = screen.getByRole('button', { name: 'Submit', id: 'clickable-delete-udp-confirmation-confirm' });
      await userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('test change from sushi to aggregator', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('form is invalid when changing from sushi to aggregator', async () => {
      await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), 'FooBar');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['sushi']);
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), ['Counter-Sushi 4.1']);
      await userEvent.type(screen.getByRole('textbox', { name: /service url/i }), 'http://abc');

      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: 'Report type' });
      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);
      await userEvent.click(screen.getByText('BR1'));
      await userEvent.type(screen.getByLabelText(/Harvesting start/i), '01/2020');
      await userEvent.type(screen.getByRole('textbox', { name: /customer id/i }), 'MyCustomerID');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);
      await userEvent.click(screen.getByRole('button', { name: 'Save & close' }));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('test required attributes for harvesting status choice', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting status is active', async () => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');

      expect(screen.getByRole('textbox', { name: 'Provider name' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Description' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvest statistics via' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Aggregator' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Vendor code' })).not.toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: /service url/i })).toBeRequired();

      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
      // click somewhere outside of the selection list to close the menu without choosing any report
      await userEvent.click(screen.getByRole('heading', { name: 'Create usage data provider' }));
      expect(screen.getByRole('button', { name: 'Report type' })).toHaveClass('hasError');

      expect(screen.getByLabelText(/Harvesting start/i)).toBeRequired();
      expect(screen.getByLabelText('Harvesting end')).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Customer ID' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'API key' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Platform' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor name' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor mail' })).not.toBeRequired();
    });

    test('harvesting status is inactive', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), ['inactive']);

      expect(screen.getByRole('textbox', { name: 'Provider name' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Description' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvest statistics via' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Aggregator' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Vendor code' })).not.toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Service type' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: /service url/i })).not.toBeRequired();

      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
      expect(screen.getByRole('button', { name: 'Report type' })).not.toHaveClass('hasError');

      expect(screen.getByLabelText('Harvesting start')).not.toBeRequired();
      expect(screen.getByLabelText('Harvesting end')).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Customer ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'API key' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Platform' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor name' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor mail' })).not.toBeRequired();
    });

    test('saving a named inactive provider', async () => {
      const providerStatusCombobox = screen.getByRole('combobox', { name: 'Provider status' });
      const harvestingStatusCombobox = screen.getByRole('combobox', { name: 'Harvesting status' });
      const providerNameTextbox = screen.getByRole('textbox', { name: 'Provider name' });
      const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });

      // status = active && name set
      await userEvent.selectOptions(providerStatusCombobox, ['active']);
      await userEvent.selectOptions(harvestingStatusCombobox, ['active']);
      await userEvent.type(providerNameTextbox, 'FooBar');
      expect(harvestingStatusCombobox).toHaveValue('active');
      expect(providerNameTextbox).toHaveValue('FooBar');
      await userEvent.click(saveAndCloseButton);
      expect(onSubmit).not.toHaveBeenCalled();

      // status = inactive && name set
      await userEvent.selectOptions(harvestingStatusCombobox, ['inactive']);
      expect(harvestingStatusCombobox).toHaveValue('inactive');
      expect(providerNameTextbox).toHaveValue('FooBar');
      await userEvent.click(saveAndCloseButton);
      expect(onSubmit).toHaveBeenCalled();
    });

    describe('test required value of customerId field', () => {
      test('change harvest statistics via from sushi to aggregator', async () => {
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['sushi']);
        await userEvent.click(screen.getByRole('textbox', { name: 'Customer ID' }));
        await userEvent.click(screen.getByRole('textbox', { name: 'Platform' }));

        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Customer ID' })).toBeRequired();

        await userEvent.selectOptions(
          screen.getByRole('combobox', { name: /harvest statistics via/i }),
          ['aggregator']
        );
        expect(screen.getByRole('textbox', { name: 'Customer ID' })).not.toBeRequired();
        expect(screen.queryByText('Required')).not.toBeInTheDocument();
      });
    });
  });

  describe('test that reqId and apiKey fields are disabled and cleared depending on service type selection', () => {
    const reportReleaseProvider = {
      label: 'Provider with reqId and apiKey',
      harvestingConfig: { harvestVia: 'sushi' },
      sushiCredentials: {
        requestorId: 'id1234',
        apiKey: 'key1234',
      },
    };

    const testSelectServiceType = async (serviceType) => {
      renderUDPForm(stripes, reportReleaseProvider);
      const reqIdBox = screen.getByRole('textbox', { name: 'Requestor ID' });
      const serviceTypeSelect = screen.getByRole('combobox', { name: /service type/i });

      expect(reqIdBox).toBeEnabled();
      expect(reqIdBox).toHaveValue('id1234');

      await userEvent.selectOptions(serviceTypeSelect, serviceType);

      expect(serviceTypeSelect.value).toBe(serviceType);
      expect(reqIdBox).toHaveValue('id1234');
    };

    test('select service type 4', async () => {
      await testSelectServiceType('cs41');
    });

    test('select service type 5', async () => {
      await testSelectServiceType('cs50');
    });

    test('select service type 5.1', async () => {
      await testSelectServiceType('cs51');
    });

    test('change reqId and apiKey with service type 5 selected', async () => {
      renderUDPForm(stripes, { harvestingConfig: { sushiConfig: { serviceType: 'cs50' } } });
      const reqIdBox = screen.getByRole('textbox', { name: 'Requestor ID' });
      const apiKeyBox = screen.getByRole('textbox', { name: 'API key' });

      expect(reqIdBox).toBeEnabled();
      expect(apiKeyBox).toBeEnabled();

      await userEvent.type(reqIdBox, 'a');
      expect(reqIdBox).toHaveValue('a');
      expect(apiKeyBox).toBeEnabled();
      await userEvent.clear(reqIdBox);
      expect(apiKeyBox).toBeEnabled();

      await userEvent.type(apiKeyBox, 'a');
      expect(apiKeyBox).toHaveValue('a');
      expect(reqIdBox).toBeEnabled();
      await userEvent.clear(apiKeyBox);
      expect(reqIdBox).toBeEnabled();
    });
  });

  describe('set provider status inactive if harvester status is active', () => {
    beforeEach(async () => {
      renderUDPForm(stripes, initialUdp);

      const providerStatusCombobox = screen.getByRole('combobox', { name: 'Provider status' });
      await userEvent.selectOptions(providerStatusCombobox, ['inactive']);
    });

    it('should open modal with headline, message and buttons', async () => {
      const changeStatusModal =
        screen.getByRole(
          'dialog',
          { name: 'The harvesting status is still active, although the provider status has been set to inactive.' }
        );
      expect(within(changeStatusModal).getByRole(
        'heading',
        { name: 'Change of harvesting status?' }
      )).toBeInTheDocument();

      const cancelButton = within(changeStatusModal).getByRole('button', { name: 'Cancel' });
      const confirmButton =
        within(changeStatusModal).getByRole('button', { name: 'Set harvesting status to inactive' });
      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
    });

    test('clicking cancel should close the modal and set both status to active ', async () => {
      const changeStatusModal =
        screen.getByRole(
          'dialog',
          { name: 'The harvesting status is still active, although the provider status has been set to inactive.' }
        );
      const cancelButton = within(changeStatusModal).getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      expect(screen.getByRole('combobox', { name: 'Provider status' })).toHaveValue('active');
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toHaveValue('active');
      expect(within(changeStatusModal).queryByRole(
        'heading',
        { name: 'Change of harvesting status?' }
      )).not.toBeInTheDocument();
    });

    test('clicking confirm should close the modal, ' +
      'set both status to inactive and disable harvester select box', async () => {
      const changeStatusModal =
        screen.getByRole(
          'dialog',
          { name: 'The harvesting status is still active, although the provider status has been set to inactive.' }
        );
      const confirmButton =
        within(changeStatusModal).getByRole('button', { name: 'Set harvesting status to inactive' });
      const harvestingStatusCombobox = screen.getByRole('combobox', { name: 'Harvesting status' });
      await userEvent.click(confirmButton);

      expect(screen.getByRole('combobox', { name: 'Provider status' })).toHaveValue('inactive');
      expect(harvestingStatusCombobox).toHaveValue('inactive');
      expect(harvestingStatusCombobox).toBeDisabled();
      expect(within(changeStatusModal).queryByRole(
        'heading', { name: 'Change of harvesting status?' }
      )).not.toBeInTheDocument();
    });
  });
});
