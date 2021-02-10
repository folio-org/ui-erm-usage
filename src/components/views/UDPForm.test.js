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
});
