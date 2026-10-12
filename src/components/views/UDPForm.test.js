import { MemoryRouter } from 'react-router-dom';

import {
  act,
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

const stubHarvesterImpls = [
  {
    implementations: [
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

const supportedUdp = {
  ...initialUdp,
  harvestingConfig: {
    ...initialUdp.harvestingConfig,
    sushiConfig: { ...initialUdp.harvestingConfig.sushiConfig, serviceType: 'cs51' },
    reportRelease: '5.1',
    requestedReports: ['TR'],
  },
};

const initialValues = {
  status: 'active',
  harvestingConfig: {
    harvestingStatus: 'active',
    reportRelease: '5.1',
    sushiConfig: { serviceType: 'cs51' },
  },
};

const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderUDPForm = (stripes, udp = initialValues, harvesterImpls = stubHarvesterImpls) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <UDPForm
          data={{
            harvesterImpls,
          }}
          handlers={{ onClose }}
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

  describe('unsupported service type', () => {
    // The backend sets the harvesting status of UDPs with an unsupported service type to inactive
    const unsupportedUdp = {
      ...initialUdp,
      harvestingConfig: { ...initialUdp.harvestingConfig, harvestingStatus: 'inactive' },
    };

    const unsupportedCs51Udp = {
      ...unsupportedUdp,
      harvestingConfig: {
        ...unsupportedUdp.harvestingConfig,
        sushiConfig: { ...unsupportedUdp.harvestingConfig.sushiConfig, serviceType: 'cs51old' },
        reportRelease: '5.1',
        requestedReports: ['TR'],
      },
      sushiCredentials: { ...unsupportedUdp.sushiCredentials, apiKey: 'secret' },
    };

    test('should add current unsupported service type as selected option', () => {
      renderUDPForm(stripes, initialUdp);

      const serviceTypeSelect = screen.getByRole('combobox', { name: 'Service type' });
      expect(serviceTypeSelect).toHaveValue('cs41');
      expect(within(serviceTypeSelect).getByRole('option', { name: 'cs41 (Unsupported)' })).toBeInTheDocument();
    });

    test('should not add an unsupported option for a supported service type', () => {
      renderUDPForm(stripes, initialValues);

      const serviceTypeSelect = screen.getByRole('combobox', { name: 'Service type' });
      expect(within(serviceTypeSelect).queryByRole('option', { name: /\(Unsupported\)/ })).not.toBeInTheDocument();
    });

    test('should disable harvesting status and requested reports including the delete buttons', () => {
      renderUDPForm(stripes, unsupportedUdp);

      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Report type/ })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Delete this item' })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Add report type/ })).toBeDisabled();
    });

    test('should show a warning explaining why harvesting status and requested reports are blocked', () => {
      renderUDPForm(stripes, unsupportedUdp);

      expect(screen.getByText(/The selected service type is not supported/)).toBeVisible();
    });

    test('should not show the warning for a supported service type', () => {
      renderUDPForm(stripes, supportedUdp);

      expect(screen.queryByText(/The selected service type is not supported/)).not.toBeInTheDocument();
    });

    test('should not disable harvesting status and requested reports for a supported service type', () => {
      // With only one report there is no delete button while harvesting is active
      renderUDPForm(stripes, {
        ...supportedUdp,
        harvestingConfig: { ...supportedUdp.harvestingConfig, requestedReports: ['DR', 'TR'] },
      });

      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeEnabled();
      screen.getAllByRole('button', { name: /Report type/ }).forEach(button => expect(button).toBeEnabled());
      screen.getAllByRole('button', { name: 'Delete this item' }).forEach(button => expect(button).toBeEnabled());
      expect(screen.getByRole('button', { name: /Add report type/ })).toBeEnabled();
    });

    test('should enable harvesting status and clear requested reports after selecting a supported type', async () => {
      renderUDPForm(stripes, unsupportedUdp);

      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Service type' }), ['Counter 5.1']);
      expect(screen.getByRole('heading', { name: 'Clear report selection' })).toBeVisible();

      await userEvent.click(screen.getByRole('button', { name: 'Clear reports' }));

      // The banner is removed after its exit transition
      await waitFor(() => {
        expect(screen.queryByText(/The selected service type is not supported/)).not.toBeInTheDocument();
      });
      const harvestingStatusSelect = screen.getByRole('combobox', { name: 'Harvesting status' });
      expect(harvestingStatusSelect).toBeEnabled();
      expect(harvestingStatusSelect).toHaveValue('inactive');
      expect(screen.queryByRole('button', { name: /^Report type/ })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add report type/ })).toBeEnabled();
    });

    test('should ask to clear requested reports even if the report release does not change', async () => {
      renderUDPForm(stripes, unsupportedCs51Udp);

      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Service type' }), ['Counter 5.1']);
      expect(screen.getByRole('heading', { name: 'Clear report selection' })).toBeVisible();
    });

    test('should keep the API key if the report release does not change', async () => {
      renderUDPForm(stripes, unsupportedCs51Udp);

      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Service type' }), ['Counter 5.1']);
      await userEvent.click(screen.getByRole('button', { name: 'Clear reports' }));

      expect(screen.getByRole('textbox', { name: 'API key' })).toHaveValue('secret');
    });

    test('should not require requested reports while they are blocked', async () => {
      // harvesting status still active, e.g. if the backend has not deactivated it yet
      const udpWithoutReports = {
        ...initialUdp,
        harvestingConfig: { ...initialUdp.harvestingConfig, requestedReports: [] },
      };
      renderUDPForm(stripes, udpWithoutReports);

      await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'foo');
      await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

      expect(onSubmit).toHaveBeenCalled();
    });

    test('should keep the unsupported service type and disabled fields if clearing reports is cancelled', async () => {
      renderUDPForm(stripes, unsupportedUdp);

      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Service type' }), ['Counter 5.1']);
      // Wait for the exit transition, so the banner has to come back after cancelling
      await waitFor(() => {
        expect(screen.queryByText(/The selected service type is not supported/)).not.toBeInTheDocument();
      });
      await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));

      expect(await screen.findByText(/The selected service type is not supported/)).toBeVisible();

      expect(screen.getByRole('combobox', { name: 'Service type' })).toHaveValue('cs41');
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Report type/ })).toHaveTextContent('DR1');
      expect(screen.getByRole('button', { name: /Add report type/ })).toBeDisabled();
    });

    test('should not add an unsupported option while implementations are not loaded', () => {
      renderUDPForm(stripes, initialUdp, []);

      const serviceTypeSelect = screen.getByRole('combobox', { name: 'Service type' });
      expect(within(serviceTypeSelect).queryByRole('option', { name: /\(Unsupported\)/ })).not.toBeInTheDocument();
      expect(screen.queryByText(/The selected service type is not supported/)).not.toBeInTheDocument();
    });
  });

  describe('stored reportTypes', () => {
    const udpWithUnsupportedReport = {
      ...supportedUdp,
      harvestingConfig: { ...supportedUdp.harvestingConfig, requestedReports: ['DR1'] },
    };

    it('should show stored reportTypes if the serviceType is unsupported', () => {
      renderUDPForm(stripes, initialUdp);

      expect(screen.getByRole('button', { name: /Report type/ })).toHaveTextContent('DR1');
    });

    it('should show stored reportTypes that are not supported by the serviceType', () => {
      renderUDPForm(stripes, udpWithUnsupportedReport);

      expect(screen.getByRole('button', { name: /Report type/ })).toHaveTextContent('DR1');
    });

    it('should offer stored unsupported reportType only in its own row', async () => {
      renderUDPForm(stripes, udpWithUnsupportedReport);

      await userEvent.click(screen.getByRole('button', { name: /Add report type/ }));
      const reportTypeButtons = screen.getAllByRole('button', { name: /^Report type/ });
      await userEvent.click(reportTypeButtons[1]);

      expect(screen.getByRole('option', { name: 'DR' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'DR1' })).not.toBeInTheDocument();
    });
  });

  describe('report type options', () => {
    // The real Counter 5.0 and 5.1 implementations support the same reports, so use distinct ones here
    const implsWithDistinctReports = [
      {
        implementations: [
          { type: 'cs50', name: 'Counter 5.0', reportRelease: '5', supportedReports: ['DR', 'TR'] },
          { type: 'cs51', name: 'Counter 5.1', reportRelease: '5.1', supportedReports: ['IR', 'PR'], isDefault: true },
        ],
      },
    ];

    it('should offer the report types of the selected service type', async () => {
      renderUDPForm(stripes, initialValues, implsWithDistinctReports);

      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
      expect(screen.getByRole('option', { name: 'IR' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'DR' })).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('option', { name: 'IR' }));

      await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Service type' }), ['Counter 5.0']);
      await userEvent.click(screen.getByRole('button', { name: 'Clear reports' }));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));

      expect(screen.getByRole('option', { name: 'DR' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'TR' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'IR' })).not.toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'PR' })).not.toBeInTheDocument();
    }, 10000);
  });

  describe('service url trimming', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('trims whitespace from service url', async () => {
      const serviceUrlInput = screen.getByRole('textbox', { name: /service url/i });
      await userEvent.click(serviceUrlInput);
      await userEvent.paste('  http://example.com/sushi   ');
      await userEvent.tab();

      expect(serviceUrlInput).toHaveValue('http://example.com/sushi');
    });
  });

  describe('test service type and selected reports options', () => {
    beforeEach(() => {
      renderUDPForm(stripes, {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test.each([
      { from: 'Counter 5.0', to: 'Counter 5.1' },
      { from: 'Counter 5.1', to: 'Counter 5.0' },
    ])('should clear the selected reports when switching from $from to $to', async ({ from, to }) => {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), [from]);
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: /Report type/ });
      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);

      await userEvent.click(screen.getByRole('option', { name: /TR/ }));
      expect(screen.getByLabelText('TR')).toBeInTheDocument();

      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), [to]);
      expect(screen.getByRole('heading', { name: 'Clear report selection' })).toBeVisible();

      await userEvent.click(screen.getByRole('button', { name: 'Clear reports' }));
      expect(screen.queryByLabelText('TR')).not.toBeInTheDocument();
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
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), ['Counter 5.0']);
      await userEvent.type(screen.getByRole('textbox', { name: /service url/i }), 'http://abc');
      await userEvent.type(screen.getByRole('textbox', { name: /customer id/i }), 'MyCustomerID');

      const reportTypeButton = screen.getByRole('button', { name: 'Report type' });

      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);
      await userEvent.click(await screen.findByText('TR'));

      await userEvent.type(screen.getByLabelText(/Harvesting start/i), '01/2020');

      await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          harvestingConfig: expect.objectContaining({ requestedReports: ['TR'] }),
        }),
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe('required requested reports', () => {
    const activeUdp = {
      label: 'Provider',
      status: 'active',
      harvestingConfig: {
        harvestingStatus: 'active',
        reportRelease: '5.1',
        sushiConfig: { serviceType: 'cs51', serviceUrl: 'http://abc' },
        harvestingStart: '2020-01',
      },
      sushiCredentials: { customerId: 'MyCustomerID' },
    };

    const getReportTypeRow = () => document.querySelector('#reportType-selection-0');

    test.each`
      status        | reports         | rows | deleteButtons
      ${'active'}   | ${[]}           | ${1} | ${0}
      ${'active'}   | ${['TR']}       | ${1} | ${0}
      ${'active'}   | ${['TR', 'DR']} | ${2} | ${2}
      ${'inactive'} | ${[]}           | ${0} | ${0}
      ${'inactive'} | ${['TR']}       | ${1} | ${1}
    `('while $status with reports $reports, should show rows: $rows, delete buttons: $deleteButtons', ({
      status, reports, rows, deleteButtons,
    }) => {
      renderUDPForm(stripes, {
        ...activeUdp,
        harvestingConfig: { ...activeUdp.harvestingConfig, harvestingStatus: status, requestedReports: reports },
      });

      expect(screen.queryAllByRole('button', { name: /^Report type/ })).toHaveLength(rows);
      expect(screen.queryAllByRole('button', { name: 'Delete this item' })).toHaveLength(deleteButtons);
    });

    test('should leave a new form unchanged while showing the first row', () => {
      renderUDPForm(stripes);

      expect(screen.getByRole('button', { name: 'Report type' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save & close/ })).toBeDisabled();
    });

    test('should show "Required" for the first row when saving without a report type', async () => {
      renderUDPForm(stripes, activeUdp);

      await userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'foo');
      await userEvent.click(screen.getByRole('button', { name: /Save & close/ }));

      expect(onSubmit).not.toHaveBeenCalled();
      expect(within(getReportTypeRow()).getByText('Required')).toBeVisible();
    });

    test('should keep the first row and add a second one when adding a report type', async () => {
      renderUDPForm(stripes, activeUdp);

      await userEvent.click(screen.getByRole('button', { name: /Add report type/ }));

      expect(screen.getAllByRole('button', { name: 'Report type' })).toHaveLength(2);
    });

    test('should keep the focus after selecting a report type in the first row with the keyboard', async () => {
      renderUDPForm(stripes, activeUdp);

      act(() => screen.getByRole('button', { name: 'Report type' }).focus());
      await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

      expect(getReportTypeRow()).toHaveTextContent('DR');
      expect(screen.getByPlaceholderText('Filter options list')).toHaveFocus();
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

      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: /service url/i })).toBeRequired();

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
  });

  describe('requestor ID and API key when changing the service type', () => {
    const reportReleases = { cs50: '5', cs51: '5.1' };

    const renderWithCredentials = ({ from, requestor, requestedReports }) => renderUDPForm(stripes, {
      label: 'Provider',
      ...(from !== 'no service type' && {
        harvestingConfig: { reportRelease: reportReleases[from], sushiConfig: { serviceType: from }, requestedReports },
      }),
      sushiCredentials: { requestorId: requestor === 'with' ? 'id1234' : undefined, apiKey: 'key1234' },
    });

    test.each`
      from                 | to        | requestor
      ${'no service type'} | ${'cs50'} | ${'with'}
      ${'no service type'} | ${'cs51'} | ${'with'}
      ${'cs50'}            | ${'cs51'} | ${'with'}
      ${'cs51'}            | ${'cs50'} | ${'with'}
      ${'no service type'} | ${'cs50'} | ${'without'}
      ${'no service type'} | ${'cs51'} | ${'without'}
      ${'cs50'}            | ${'cs51'} | ${'without'}
      ${'cs51'}            | ${'cs50'} | ${'without'}
    `('should keep the credentials when changing from $from to $to $requestor requestor ID', async ({
      from, to, requestor,
    }) => {
      renderWithCredentials({ from, requestor });
      const serviceTypeSelect = screen.getByRole('combobox', { name: 'Service type' });

      await userEvent.selectOptions(serviceTypeSelect, to);

      expect(serviceTypeSelect).toHaveValue(to);
      expect(screen.getByRole('textbox', { name: 'Requestor ID' })).toHaveValue(requestor === 'with' ? 'id1234' : '');
      expect(screen.getByRole('textbox', { name: 'API key' })).toHaveValue('key1234');
    });

    test('should keep the API key if clearing the report selection is cancelled', async () => {
      renderWithCredentials({ from: 'cs51', requestor: 'with', requestedReports: ['TR'] });
      const serviceTypeSelect = screen.getByRole('combobox', { name: 'Service type' });
      const apiKeyBox = screen.getByRole('textbox', { name: 'API key' });

      await userEvent.selectOptions(serviceTypeSelect, 'cs50');
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByRole('heading', { name: 'Clear report selection' })).toBeVisible();
      expect(apiKeyBox).toHaveValue('key1234');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

      expect(serviceTypeSelect).toHaveValue('cs51');
      expect(apiKeyBox).toHaveValue('key1234');
    });

    test.each([
      { record: 'Counter 5.0', udp: { harvestingConfig: { sushiConfig: { serviceType: 'cs50' } } } },
      { record: 'stored Counter 4', udp: initialUdp },
    ])('should allow editing requestor ID and API key of a $record record', async ({ udp }) => {
      renderUDPForm(stripes, udp);
      const reqIdBox = screen.getByRole('textbox', { name: 'Requestor ID' });
      const apiKeyBox = screen.getByRole('textbox', { name: 'API key' });

      await userEvent.clear(reqIdBox);
      await userEvent.type(reqIdBox, 'id');
      await userEvent.clear(apiKeyBox);
      await userEvent.type(apiKeyBox, 'key');

      expect(reqIdBox).toHaveValue('id');
      expect(apiKeyBox).toHaveValue('key');
    });
  });

  describe('set provider status inactive if harvester status is active', () => {
    beforeEach(async () => {
      renderUDPForm(stripes, supportedUdp);

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
