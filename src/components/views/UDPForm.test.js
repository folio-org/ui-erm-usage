import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
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

const onDelete = jest.fn();
const onClose = jest.fn();
const handleSubmit = jest.fn();
const onSubmit = jest.fn();
const clearReports = jest.fn();
const setReportRelease = jest.fn();

const renderUDPForm = (stripes) => {
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
  });

  test('renders form', async () => {
    renderUDPForm(stripes);
    expect(screen.getByText('Harvesting status')).toBeVisible();
  });

  describe('harvestVia', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
      userEvent.selectOptions(
        screen.getByLabelText('Harvesting status', { exact: false }),
        ['active']
      );
    });

    test('select harvestVia=aggregator', async () => {
      userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['aggregator']
      );

      expect(
        screen.getByRole('combobox', { name: 'Aggregator' })
      ).not.toHaveAttribute('disabled');

      expect(
        screen.getByRole('combobox', { name: 'Service type' })
      ).toHaveAttribute('disabled');
    });

    test('select harvestVia=sushi', async () => {
      userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['sushi']
      );

      expect(
        screen.getByRole('combobox', { name: 'Aggregator' })
      ).toHaveAttribute('disabled');

      expect(
        screen.getByRole('combobox', { name: 'Service type' })
      ).not.toHaveAttribute('disabled');
    });
  });

  describe('report release and select reports', () => {
    beforeEach(() => {
      renderUDPForm(stripes);

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

    test('switch between counter 4 and 5 reports', async () => {
      userEvent.selectOptions(
        screen.getByLabelText('Report release', { exact: false }),
        ['4']
      );
      userEvent.click(await screen.findByText('Add report type'));
      userEvent.click(await screen.findByText('Report type'));
      userEvent.click(await screen.findByText('BR1'));
      expect(screen.getAllByText('BR1').length).toEqual(2);

      userEvent.selectOptions(
        screen.getByLabelText('Report release', { exact: false }),
        ['5']
      );
      expect(screen.getByText('Clear report selection')).toBeVisible();

      userEvent.click(await screen.findByText('Clear reports'));
      userEvent.click(await screen.findByText('Add report type'));

      userEvent.click(await screen.findByText('Report type'));
      userEvent.click(await screen.findByText('PR'));
      expect(screen.getAllByText('PR').length).toEqual(2);
      expect(screen.queryAllByText('BR1').length).toEqual(0);
    });
  });

  describe('harvesting start and end', () => {
    beforeEach(() => {
      renderUDPForm(stripes);
    });

    test('harvesting start invalid format', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      userEvent.type(startInput, '2020-ab');
      userEvent.tab();
      expect(
        screen.getByText('Date invalid', { exact: false })
      ).toBeInTheDocument();
    });

    test('harvesting start valid format', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      userEvent.type(startInput, '2020-01');
      userEvent.tab();
      expect(
        screen.queryByText('Date invalid', { exact: false })
      ).not.toBeInTheDocument();
    });

    test('harvesting start < end is invalid', async () => {
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      userEvent.type(startInput, '2020-02');

      const endInput = screen.getByLabelText('Harvesting end', {
        exact: false,
      });
      userEvent.type(endInput, '2020-01');
      userEvent.tab();
      expect(
        screen.getByText('End date must be greater than start date', {
          exact: false,
        })
      ).toBeInTheDocument();
    });
  });

  describe('fill form', () => {
    beforeEach(() => {
      renderUDPForm(stripes);

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

    test('happy path', async () => {
      userEvent.type(
        screen.getByLabelText('Provider name', {
          exact: false,
        }),
        'FooBar'
      );
      userEvent.selectOptions(
        screen.getByLabelText('Harvesting status', { exact: false }),
        ['active']
      );
      userEvent.selectOptions(
        screen.getByLabelText('Harvest statistics via', { exact: false }),
        ['aggregator']
      );
      userEvent.selectOptions(
        screen.getByLabelText('Aggregator', { exact: false }),
        ['5b6ba83e-d7e5-414e-ba7b-134749c0d950']
      );

      userEvent.selectOptions(
        screen.getByLabelText('Report release', { exact: false }),
        ['4']
      );
      userEvent.click(await screen.findByText('Add report type'));
      userEvent.click(await screen.findByText('Report type'));
      userEvent.click(await screen.findByText('BR1'));
      const startInput = screen.getByLabelText('Harvesting start', {
        exact: false,
      });
      userEvent.type(startInput, '2020-01');

      userEvent.click(await screen.findByText('Save & close'));
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
