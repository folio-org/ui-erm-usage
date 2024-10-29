import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
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
          reportRelease: '4',
        },
      },
    ],
  },
];

const stubHarvesterImpls = [
  {
    value: 'cs41',
    label: 'Counter Sushi 4.1',
  },
  {
    value: 'cs50',
    label: 'Counter Sushi 5.0',
  },
];

const initialUdp = {
  id: '0ba00047-b6cb-417a-a735-e2c1e45e30f1',
  label: 'Usage data provider',
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

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();

const renderUDPForm = (stripes, udp = {}) => {
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

  test('should render form', async () => {
    renderUDPForm(stripes);
    expect(screen.getByText('Harvesting status')).toBeVisible();
  });

  describe('test harvestVia options', () => {
    beforeEach(async () => {
      renderUDPForm(stripes);
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');
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

  describe('test report release and selected reports options', () => {
    beforeEach(() => {
      renderUDPForm(stripes, {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const testSwitchFromCounterRelease4To5 = async (reportRelease) => {
      expect(await screen.getByRole('option', { name: 'Counter 4' })).toBeInTheDocument();
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /report release/i }), ['Counter 4']);
      await userEvent.click(await screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = await screen.getByRole('button', { name: /Report type/ });
      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);

      await userEvent.click(await screen.getByRole('option', { name: /BR1/ }));
      expect(screen.getByLabelText('BR1')).toBeInTheDocument();

      await userEvent.selectOptions(screen.getByRole('combobox', { name: /report release/i }), [reportRelease]);
      expect(screen.getByRole('heading', { name: 'Clear report selection' })).toBeVisible();

      await userEvent.click(await screen.getByRole('button', { name: 'Clear reports' }));
      await userEvent.click(await screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButtonNew = screen.getByRole('button', { name: 'Report type' });
      expect(reportTypeButtonNew).toBeInTheDocument();
      await userEvent.click(reportTypeButtonNew);
      expect(screen.getByRole('option', { name: /DR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /IR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /PR/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /TR/ })).toBeInTheDocument();
      await userEvent.click(await screen.getByRole('option', { name: /PR/ }));
      expect(screen.getByLabelText('PR')).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: /BR1/ })).not.toBeInTheDocument();
      expect(screen.queryByLabelText('BR1')).not.toBeInTheDocument();
    };

    test('select reportRelease 5', async () => {
      await testSwitchFromCounterRelease4To5('Counter 5');
    }, 10000);

    test('select reportRelease 5.1', async () => {
      await testSwitchFromCounterRelease4To5('Counter 5.1');
    }, 10000);
  });

  describe('test harvesting start and end', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting start invalid format', async () => {
      const startInput = screen.getByRole('textbox', { name: /harvesting start/i });
      await userEvent.type(startInput, '2020-ab');
      await userEvent.tab();
      expect(screen.getByText('Date invalid', { exact: false })).toBeInTheDocument();
    });

    test('harvesting start valid format', async () => {
      const startInput = screen.getByRole('textbox', { name: /harvesting start/i });
      await userEvent.type(startInput, '2020-01');
      await userEvent.tab();
      expect(screen.queryByText('Date invalid', { exact: false })).not.toBeInTheDocument();
    });

    test('harvesting start < end is invalid', async () => {
      const startInput = screen.getByRole('textbox', { name: /harvesting start/i });
      await userEvent.type(startInput, '2020-02');

      const endInput = screen.getByRole('textbox', { name: /harvesting end/i });
      await userEvent.type(endInput, '2020-01');
      await userEvent.tab();
      expect(screen.getByText('End date must be greater than start date', { exact: false })).toBeInTheDocument();
    });
  });

  describe('test fill form', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('happy path', async () => {
      await userEvent.type(screen.getByRole('textbox', { name: /provider name/i }), 'FooBar');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvesting status/i }), 'active');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /aggregator/i }), ['5b6ba83e-d7e5-414e-ba7b-134749c0d950']);
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /report release/i }), ['Counter 4']);
      await userEvent.click(await screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: 'Report type' });

      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);
      await userEvent.click(await screen.findByText('BR1'));

      const startInput = screen.getByRole('textbox', { name: /harvesting start/i });
      await userEvent.type(startInput, '2020-01');

      await userEvent.click(await screen.getByRole('button', { name: /Save & close/ }));
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
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /service type/i }), ['cs41']);
      await userEvent.type(screen.getByRole('textbox', { name: /service url/i }), 'http://abc');

      expect(screen.getByText('Counter 4')).toBeInTheDocument();
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /report release/i }), ['Counter 4']);
      await userEvent.click(await screen.getByRole('button', { name: /add report type/i }));

      const reportTypeButton = screen.getByRole('button', { name: 'Report type' });
      expect(reportTypeButton).toBeInTheDocument();
      await userEvent.click(reportTypeButton);
      await userEvent.click(await screen.getByText('BR1'));
      await userEvent.type(screen.getByRole('textbox', { name: /harvesting start/i }), '2020-01');
      await userEvent.type(screen.getByRole('textbox', { name: /customer id/i }), 'MyCustomerID');
      await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);
      await userEvent.click(await screen.getByRole('button', { name: 'Save & close' }));
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
      expect(screen.getByRole('textbox', { name: 'Service URL' })).toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Report release' })).toBeRequired();
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
      // click somewhere outside of the selection list to close the menu without choosing any report
      await userEvent.click(screen.getByRole('heading', { name: 'Create usage data provider' }));
      expect(screen.getByRole('button', { name: 'Report type' })).toHaveClass('hasError');

      expect(screen.getByRole('textbox', { name: 'Harvesting start' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Harvesting end' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Customer ID' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'API key' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Platform' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor name' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor mail' })).not.toBeRequired();
    });

    test('harvesting status is inactive', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), [
        'inactive',
      ]);

      expect(screen.getByRole('textbox', { name: 'Provider name' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Description' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvest statistics via' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Aggregator' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Vendor code' })).not.toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Service type' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Service URL' })).not.toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Report release' })).not.toBeRequired();
      await userEvent.click(screen.getByRole('button', { name: /add report type/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
      expect(screen.getByRole('button', { name: 'Report type' })).not.toHaveClass('hasError');

      expect(screen.getByRole('textbox', { name: 'Harvesting start' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Harvesting end' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Customer ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor ID' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'API key' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Platform' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor name' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Requestor mail' })).not.toBeRequired();
    });

    test('saving a named inactive provider', async () => {
      const harvestingStatusCombobox = screen.getByRole('combobox', { name: 'Harvesting status' });
      const providerNameTextbox = screen.getByRole('textbox', { name: 'Provider name' });
      const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });

      // status = active && name set
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

        await userEvent.selectOptions(screen.getByRole('combobox', { name: /harvest statistics via/i }), ['aggregator']);
        expect(screen.getByRole('textbox', { name: 'Customer ID' })).not.toBeRequired();
        expect(screen.queryByText('Required')).not.toBeInTheDocument();
      });
    });
  });

  describe('test that reqId and apiKey fields are disabled and cleared depending on reportRelease selection', () => {
    const reportReleaseProvider = {
      label: 'Provider with reqId and apiKey',
      sushiCredentials: {
        requestorId: 'id1234',
        apiKey: 'key1234',
      },
    };

    const testSelectReportRelease = async (reportRelease) => {
      renderUDPForm(stripes, reportReleaseProvider);
      const reqIdBox = screen.getByRole('textbox', { name: 'Requestor ID' });
      const releaseSelectBox = screen.getByRole('combobox', { name: /report release/i });

      expect(reqIdBox).toBeEnabled();
      expect(reqIdBox).toHaveValue('id1234');

      await userEvent.selectOptions(releaseSelectBox, reportRelease);

      expect(releaseSelectBox.value).toBe(reportRelease);
      expect(reqIdBox).toHaveValue('id1234');
    };

    test('select reportRelease 4', async () => {
      testSelectReportRelease('4');
    });

    test('select reportRelease 5', async () => {
      testSelectReportRelease('5');
    });

    test('select reportRelease 5.1', async () => {
      testSelectReportRelease('5.1');
    });

    test('change reqId and apiKey with reportRelease 5 selected', async () => {
      renderUDPForm(stripes, { harvestingConfig: { reportRelease: '5' } });
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
});
