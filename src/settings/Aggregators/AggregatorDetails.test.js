import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StripesContext, useStripes } from '@folio/stripes/core';

import AggregatorDetails from './AggregatorDetails';
import renderWithIntl from '../../../test/jest/helpers';
import { downloadCredentials } from '../../util/downloadReport';
import aggregator from '../../../test/fixtures/aggregator';

const initialValues = aggregator;
const aggregators = [
  {
    value: 'NSS',
    label: 'Nationaler Statistikserver',
  },
];

jest.mock('../../util/downloadReport');

const renderAggregatorDetails = (stripes) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <AggregatorDetails
        aggregators={aggregators}
        initialValues={initialValues}
        stripes={stripes}
      />
    </StripesContext.Provider>
  );
};

describe('AggregatorDetails', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderAggregatorDetails(stripes);
  });

  test('should render AggregatorDetails', () => {
    expect(screen.getByText('Aggregator Test')).toBeVisible();
    expect(screen.getByText('Nationaler Statistikserver')).toBeVisible();
    expect(screen.getByText('http://aggregagtor.de')).toBeVisible();
  });

  describe('download credentials', () => {
    beforeEach(() => {
      downloadCredentials.mockImplementation(() => Promise.resolve());
    });

    test('download csv', async () => {
      const downloadCSVButton = screen.getByText('Download as CSV');
      await userEvent.click(downloadCSVButton);

      expect(downloadCredentials).toHaveBeenCalled();
    });

    test('download xlsx', async () => {
      const downloadXLSXButton = screen.getByText('Download as XLSX');
      await userEvent.click(downloadXLSXButton);

      expect(downloadCredentials).toHaveBeenCalled();
    });
  });
});
