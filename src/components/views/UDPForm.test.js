import React from 'react';
import { screen, waitForElementToBeRemoved } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
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
    reportRelease: 4,
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
const clearReports = jest.fn();
const setReportRelease = jest.fn();

const renderUDPForm = (stripes, udp = {}) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          mutators={{
            clearSelectedReports: clearReports,
            setReportRelease,
            ...arrayMutators,
          }}
          onSubmit={jest.fn}
          render={() => (
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
          )}
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
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), [
        'active',
      ]);
    });

    test('should enable aggregator options', async () => {
      await userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['aggregator']
      );

      expect(screen.getByRole('combobox', { name: 'Aggregator' })).toBeEnabled();
      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeDisabled();
    });

    test('should enable sushi options', async () => {
      await userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['sushi']
      );

      expect(screen.getByRole('combobox', { name: 'Aggregator' })).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeEnabled();
    });
  });

  describe('test report release and selected reports options', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('should switch between counter 4 and 5 reports', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Report release', { exact: false }), [
        '4',
      ]);
      await userEvent.click(await screen.findByText('Add report type'));
      await userEvent.click(await screen.findByText('Report type'));
      await userEvent.click(await screen.findByText('BR1'));
      expect(screen.getAllByText('BR1').length).toEqual(2);

      await userEvent.selectOptions(screen.getByLabelText('Report release', { exact: false }), [
        '5',
      ]);
      expect(screen.getByText('Clear report selection')).toBeVisible();

      await userEvent.click(await screen.findByText('Clear reports'));
      await userEvent.click(await screen.findByText('Add report type'));

      await userEvent.click(await screen.findByText('Report type'));
      await userEvent.click(await screen.findByText('PR'));
      expect(screen.getAllByText('PR').length).toEqual(2);
      expect(screen.queryAllByText('BR1').length).toEqual(0);
    });
  });

  describe('test harvesting start and end', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting start invalid format', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      await userEvent.type(startInput, '2020-ab');
      await userEvent.tab();
      expect(screen.getByText('Date invalid', { exact: false })).toBeInTheDocument();
    });

    test('harvesting start valid format', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      await userEvent.type(startInput, '2020-01');
      await userEvent.tab();
      expect(screen.queryByText('Date invalid', { exact: false })).not.toBeInTheDocument();
    });

    test('harvesting start < end is invalid', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      await userEvent.type(startInput, '2020-02');

      const endInput = screen.getByLabelText('Harvesting end', {
        exact: false,
      });
      await userEvent.type(endInput, '2020-01');
      await userEvent.tab();
      expect(
        screen.getByText('End date must be greater than start date', {
          exact: false,
        })
      ).toBeInTheDocument();
    });
  });

  describe('test fill form', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('happy path', async () => {
      await userEvent.type(
        screen.getByLabelText('Provider name', {
          exact: false,
        }),
        'FooBar'
      );
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), [
        'active',
      ]);
      await userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['aggregator']
      );
      await userEvent.selectOptions(screen.getByLabelText('Aggregator', { exact: false }), [
        '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
      ]);

      await userEvent.selectOptions(screen.getByLabelText('Report release', { exact: false }), [
        '4',
      ]);
      await userEvent.click(await screen.findByText('Add report type'));
      await userEvent.click(await screen.findByText('Report type'));
      await userEvent.click(await screen.findByText('BR1'));
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      await userEvent.type(startInput, '2020-01');

      await userEvent.click(await screen.findByText('Save & close'));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('test delete UDP', () => {
    beforeEach(() => {
      renderUDPForm(stripes, initialUdp);
    });

    test('delete modal is shown', async () => {
      await userEvent.click(await screen.findByText('Delete'));
      expect(screen.getByText('Delete usage data Provider')).toBeInTheDocument();
    });

    test('click cancel delete', async () => {
      await userEvent.click(await screen.findByText('Delete'));
      const cancel = screen.findByRole('button', {
        name: 'Cancel',
        id: 'clickable-delete-udp-confirmation-cancel',
      });
      await userEvent.click(await cancel);
      await waitForElementToBeRemoved(() => screen.queryByText('Delete usage data Provider'));
      expect(onDelete).not.toHaveBeenCalled();
    });

    test('click submit delete', async () => {
      await userEvent.click(await screen.findByText('Delete'));
      const submit = screen.getByRole('button', {
        name: 'Submit',
        id: 'clickable-delete-udp-confirmation-confirm',
      });
      await userEvent.click(submit);
      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('test change from sushi to aggregator', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('form is invalid when changing from sushi to aggregator', async () => {
      await userEvent.type(
        screen.getByLabelText('Provider name', {
          exact: false,
        }),
        'FooBar'
      );
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), [
        'active',
      ]);
      await userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['sushi']
      );
      await userEvent.selectOptions(screen.getByLabelText('Service type', { exact: false }), [
        'cs41',
      ]);
      await userEvent.type(
        screen.getByLabelText('Service URL', {
          exact: false,
        }),
        'http://abc'
      );

      await userEvent.selectOptions(screen.getByLabelText('Report release', { exact: false }), [
        '4',
      ]);
      await userEvent.click(await screen.findByText('Add report type'));
      await userEvent.click(await screen.findByText('Report type'));
      await userEvent.click(await screen.findByText('BR1'));

      await userEvent.type(
        screen.getByLabelText('Harvesting start', {
          exact: false,
        }),
        '2020-01'
      );

      await userEvent.type(
        screen.getByLabelText('Customer ID', {
          exact: false,
        }),
        'MyCustomerID'
      );

      await userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['aggregator']
      );

      await userEvent.click(await screen.findByText('Save & close'));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('test required attributes for harvesting status choice', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting status is active', async () => {
      await userEvent.selectOptions(screen.getByLabelText('Harvesting status', { exact: false }), [
        'active',
      ]);

      expect(screen.getByRole('textbox', { name: 'Provider name' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Description' })).not.toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvesting status' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Harvest statistics via' })).toBeRequired();
      expect(screen.getByRole('combobox', { name: 'Aggregator' })).not.toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Vendor code' })).not.toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Service type' })).toBeRequired();
      expect(screen.getByRole('textbox', { name: 'Service URL' })).toBeRequired();

      expect(screen.getByRole('combobox', { name: 'Report release' })).toBeRequired();
      await userEvent.click(screen.getByText('Add report type'));
      await userEvent.click(screen.getByRole('button', { name: 'Report type' }));
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
      await userEvent.click(screen.getByText('Add report type'));
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

    describe('test required value of customerId field', () => {
      test('change harvest statistics via from sushi to aggregator', async () => {
        await userEvent.selectOptions(
          screen.getByLabelText('Harvesting status', { exact: false }),
          ['active']
        );
        await userEvent.selectOptions(
          screen.getByLabelText('Harvest statistics via', { exact: false }),
          ['sushi']
        );
        await userEvent.click(screen.getByRole('textbox', { name: 'Customer ID' }));
        await userEvent.click(screen.getByRole('textbox', { name: 'Platform' }));

        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Customer ID' })).toBeRequired();

        await userEvent.selectOptions(
          screen.getByLabelText('Harvest statistics via', { exact: false }),
          ['aggregator']
        );
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
      // const apiKeyBox = screen.getByRole('textbox', { name: 'API key' });
      const releaseSelectBox = screen.getByLabelText('Report release', { exact: false });

      expect(reqIdBox).toBeEnabled();
      expect(reqIdBox).toHaveValue('id1234');

      await userEvent.selectOptions(releaseSelectBox, reportRelease.toString());

      expect(releaseSelectBox.value).toBe(reportRelease.toString());
      expect(reqIdBox).toHaveValue('id1234');
    };

    test('select reportRelease 4', async () => {
      testSelectReportRelease(4);
    });

    test('select reportRelease 5', async () => {
      testSelectReportRelease(5);
    });

    test('change reqId and apiKey with reportRelease 5 selected', async () => {
      renderUDPForm(stripes, { harvestingConfig: { reportRelease: 5 } });
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
