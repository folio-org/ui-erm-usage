import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { CalloutContext, StripesContext, useStripes } from '@folio/stripes/core';

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

const renderAggregatorDetails = (stripes, sendCallout) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <CalloutContext.Provider value={{ sendCallout }}>
        <AggregatorDetails
          aggregators={aggregators}
          initialValues={initialValues}
          stripes={stripes}
        />
      </CalloutContext.Provider>
    </StripesContext.Provider>
  );
};

describe('AggregatorDetails', () => {
  let stripes;
  const sendCalloutMock = jest.fn();

  beforeEach(() => {
    stripes = useStripes();
    renderAggregatorDetails(stripes, sendCalloutMock);
  });

  test('should render AggregatorDetails', () => {
    expect(screen.getByText('Aggregator Test')).toBeVisible();
    expect(screen.getByText('Nationaler Statistikserver')).toBeVisible();
    expect(screen.getByText('http://aggregagtor.de')).toBeVisible();
  });

  test('should render Expand all', async () => {
    expect(screen.getByText('Collapse all')).toBeVisible();
    await userEvent.click(screen.getByText('Collapse all'));
    expect(screen.getByText('Expand all')).toBeVisible();
    await userEvent.click(screen.getByText('Expand all'));
    expect(screen.getByText('Collapse all')).toBeVisible();
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

    test('error is displayed in callout', async () => {
      const errMsg = 'Some error happened';
      downloadCredentials.mockImplementation(() =>
        Promise.reject(new Error(errMsg)));
      const downloadCSVButton = screen.getByText('Download as CSV');
      await userEvent.click(downloadCSVButton);

      expect(sendCalloutMock).toHaveBeenCalledWith({ type: 'error', message: errMsg });
    });
  });
});
