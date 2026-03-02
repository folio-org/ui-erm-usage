import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import renderWithIntl from '../../../../test/jest/helpers';
import ReportInfoButton from './ReportInfoButton';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  return ({ icon }) => (
    <span>
      Icon
      <span className={`icon-${icon}`} data-testid="icon">{icon}</span>
    </span>
  );
});

const reportDefault = {
  id: '1ad95437-4f1b-4f3b-9654-622ff28d271d',
  downloadTime: '2020-06-11T01:24:00.948+00:00',
  release: '4',
  reportName: 'JR1',
  yearMonth: '2019-01',
  providerId: 'd54f9d37-7759-44b6-a621-f950e6332d32',
};

const reportEditedManually = {
  id: '85982ccd-5dd1-4eeb-9b44-d198e92de953',
  downloadTime: '2025-03-25T09:26:02.075+00:00',
  release: '5',
  reportName: 'TR',
  yearMonth: '2022-01',
  providerId: 'd54f9d37-7759-44b6-a621-f950e6332d32',
  reportEditedManually: true,
  editReason: 'fix report manually',
};

const reportFailed = {
  id: 'e75400fa-d6e0-48be-b083-2b11ab5a6e8a',
  downloadTime: '2020-07-09T01:08:05.231+00:00',
  failedAttempts: 5,
  failedReason:
    'Report not valid: Exception{ Severity=ERROR, Message=Usage No Longer Available for Requested Dates }',
  release: '4',
  reportName: 'JR1',
  yearMonth: '2019-11',
  providerId: 'd54f9d37-7759-44b6-a621-f950e6332d32',
};

const report3030 = {
  id: 'e75400fa-d6e0-48be-b083-2b11ab5a6e8a',
  downloadTime: '2020-07-09T01:08:05.231+00:00',
  failedAttempts: 5,
  failedReason:
    'Report not valid: Exception{Number=3030, Severity=ERROR, Message=No Usage Available for Requested Dates}',
  release: '4',
  reportName: 'JR1',
  yearMonth: '2019-11',
  providerId: 'd54f9d37-7759-44b6-a621-f950e6332d32',
};

const report3031 = {
  id: 'e75400fa-d6e0-48be-b083-2b11ab5a6e8a',
  downloadTime: '2020-07-09T01:08:05.231+00:00',
  failedAttempts: 1,
  failedReason: 'Report not valid: Exception{Number=3031, Severity=ERROR, Message=Usage Not Ready for Requested Dates}',
  release: '5',
  reportName: 'TR',
  yearMonth: '2025-07',
  providerId: '653afd8c-239f-406c-b765-489774b6ec26',
};

const report3032 = {
  'id': 'e75400fa-d6e0-48be-b083-2b11ab5a6e8a',
  'downloadTime': '2020-07-09T01:08:05.231+00:00',
  'failedAttempts': 1,
  'failedReason': 'Report not valid: Exception{Number=3032, Severity=ERROR, Message=Usage No Longer Available for Requested Dates}',
  'release': '5',
  'reportName': 'TR',
  'yearMonth': '2025-07',
  'providerId': '653afd8c-239f-406c-b765-489774b6ec26',
};

const renderReportInfoButton = (stripes, report) => {
  return renderWithIntl(
    <ReportInfoButton
      report={report}
      stripes={stripes}
    />
  );
};

describe('ReportInfoButton', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  it('should render `checked` icon and `success` style for default report', () => {
    renderReportInfoButton(stripes, reportDefault);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-check-circle');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('success');
  });

  it('should render `edit` icon and `success` style for manual edited report', () => {
    renderReportInfoButton(stripes, reportEditedManually);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-edit');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('success');
  });

  it('should render `times` icon and `danger` style for failed report', () => {
    renderReportInfoButton(stripes, reportFailed);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-times-circle');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('danger');
  });

  it('should render `default` icon anf `success` style for error 3030', () => {
    renderReportInfoButton(stripes, report3030);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-default');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('success');
  });

  it('should render `calendar` icon and `yellow` style for error 3031', () => {
    renderReportInfoButton(stripes, report3031);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-calendar');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('yellow');
  });

  it('should render `calendar` icon and `danger` style for error 3032', () => {
    renderReportInfoButton(stripes, report3032);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('icon-calendar');

    const iconButton = screen.getByRole('button', { name: /open report info/i });
    expect(iconButton).toHaveClass('danger');
  });
});
