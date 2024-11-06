import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers';
import CounterStatistics from './CounterStatistics';

const onClose = jest.fn();
const onEdit = jest.fn();

const handlers = {
  onClose,
  onEdit,
};

const providerId = '0ba00047-b6cb-417a-a735-e2c1e45e30f1';
const label = 'GOBI Library Solutions';

jest.mock('@folio/stripes/smart-components');

const mockReportFormatter = {
  report: (report) => report.report || '',
  release: (report) => report.release || '',
  '01': () => '-',
  '02': () => '-',
  '03': () => '-',
  '04': () => '-',
  '05': () => '-',
  '06': () => '-',
  '07': () => '-',
  '08': () => '-',
  '09': () => '-',
  '10': () => '-',
  '11': () => '-',
  '12': () => '-',
};

const reports = [
  {
    year: '2018',
    stats: [
      {
        '10': {
          id: 'bf4ffe1b-d9f5-4054-ba1f-2ea590a4b822',
          downloadTime: '2024-09-09T17:17:00.699+00:00',
          release: '4',
          reportName: 'BR1',
          yearMonth: '2018-10',
        },
        '11': {
          id: 'dbda8610-e1d1-4f40-bcfe-d5de351d7242',
          downloadTime: '2024-09-09T17:17:00.699+00:00',
          release: '4',
          reportName: 'BR1',
          yearMonth: '2018-11',
        },
        report: 'BR1',
        release: '4',
      },
      {
        '10': {
          id: 'bf4ffe1b-d9f5-4054-ba1f-2ea590a4b822',
          downloadTime: '2024-09-09T17:17:00.699+00:00',
          release: '4.1',
          reportName: 'BR1',
          yearMonth: '2018-10',
        },
        '11': {
          id: 'dbda8610-e1d1-4f40-bcfe-d5de351d7242',
          downloadTime: '2024-09-09T17:17:00.699+00:00',
          failedAttempts: 2,
          failedReason: 'Error getting report: Could not send Message., HTTP response 503: Service Unavailable',
          release: '4.1',
          reportName: 'BR1',
          yearMonth: '2018-11',
        },
        report: 'BR1',
        release: '4.1',
      }
    ]
  },
  {
    year: '2019',
    stats: [
      {
        report: 'TR',
        release: '5',
        '06': {
          id: '8dfeb1b3-1cf9-4a75-8ff6-628e2d0eddc2',
          downloadTime: '2024-09-09T17:17:00.700+00:00',
          release: '5',
          reportName: 'TR',
          yearMonth: '2019-06',
        }
      }
    ]
  },
  {
    year: '2020',
    stats: [
      {
        report: 'TR',
        release: '5.1',
        '06': {
          id: '8dfeb1b3-1cf9-4a75-8ff6-628e2d0eddc2',
          downloadTime: '2024-10-09T17:17:00.700+00:00',
          release: '5.1',
          reportName: 'TR',
          yearMonth: '2020-06',
        }
      }
    ]
  }
];

const renderCounterStatistics = (stripes) => {
  return renderWithIntl(
    <Accordion id="counterStatisticsAccordion" label="Counter statistics">
      <CounterStatistics
        stripes={stripes}
        providerId={providerId}
        udpLabel={label}
        reports={reports}
        handlers={handlers}
        reportFormatter={mockReportFormatter}
        showMultiMonthDownload
      />
    </Accordion>
  );
};

describe('CounterStatistics', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  it('should render CounterStatistics with StatisticsPerYear', () => {
    renderCounterStatistics(stripes);
    expect(screen.getByText('2018')).toBeInTheDocument();
    expect(screen.getByText('2019')).toBeInTheDocument();
  });

  it('should render table with report for 2019', () => {
    renderCounterStatistics(stripes);

    const accordion2019 = screen.getByText('2019');
    expect(accordion2019).toBeInTheDocument();

    userEvent.click(accordion2019);

    const section2019 = screen.getByRole('region', { name: /2019/ });
    const text = within(section2019).getByText(/TR/);
    expect(text).toBeInTheDocument();

    const headers = within(section2019).getAllByRole('columnheader');
    const expectedLabels = ['Report', 'Release', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedLabels[index]);
    });

    expect(within(section2019).getByText(/TR/)).toBeInTheDocument();
    expect(within(section2019).getByText(/5/)).toBeInTheDocument();
  });

  it('should be visible download for multiple months with report version behind report, but no failed reports', () => {
    renderCounterStatistics(stripes);

    expect(screen.getByText('Download reports for multiple months')).toBeInTheDocument();

    const reportTypeSelectBox = screen.getByRole('combobox', { name: 'Report type' });
    expect(reportTypeSelectBox).toBeInTheDocument();
    userEvent.click(reportTypeSelectBox);

    expect(screen.queryByRole('option', { name: 'BR1 (4.1)' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'BR1 (4)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'TR (5)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'TR (5.1)' })).toBeInTheDocument();
  });
});
