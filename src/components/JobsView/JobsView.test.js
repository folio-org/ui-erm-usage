import React from 'react';
import '../../../test/jest/__mock__';
import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import udpsFixture from '../../../test/fixtures/udps';
import jobsFixture from '../../../test/fixtures/jobs';
import JobsViewRoute from '../../routes/JobsViewRoute';

jest.mock('./JobsViewResultCell', () => () => (
  <div>MockedJobsViewResultCell</div>
));

const renderJobView = (jobs) => renderWithIntl(
  <MemoryRouter>
    <JobsViewRoute
      mutator={{
        query: {
          update: () => {},
        },
      }}
      resources={{
        udps: {
          records: udpsFixture,
        },
        jobs: {
          hasLoaded: true,
          records: jobs,
          other: {
            totalRecords: jobs.length,
          },
        },
        query: {
          sort: '',
        },
      }}
    />
  </MemoryRouter>
);

describe('JobView component', () => {
  it('should display no results if no job data is provided', () => {
    renderJobView([]);
    expect(screen.queryByText('The list contains no items')).toBeInTheDocument();
  });

  it('should display properly formatted results if job data is provided', () => {
    const expectedRowContent = [
      [
        'Provider / Tenant',
        'Type',
        'Start',
        'Finish',
        'Duration',
        'Running status',
        'Result',
      ],
      [
        '4a758550-3b4c-428a-9c62-504e12c5d2ad',
        'Provider',
        '9/28/2022, 11:35:00 AM',
        '',
        '',
        'In progress',
        ''
      ],
      [
        'American Chemical Society',
        'Provider',
        '9/28/2022, 11:34:00 AM',
        '9/28/2022, 11:34:00 AM',
        '0m 0s',
        'Finished',
        'MockedJobsViewResultCell',
      ],
      [
        'American Chemical Society',
        'Provider',
        '9/28/2022, 11:33:03 AM',
        '9/28/2022, 11:33:04 AM',
        '0m 1s',
        'Finished',
        'MockedJobsViewResultCell',
      ],
      [
        'diku',
        'Tenant',
        '9/28/2022, 10:30:04 AM',
        '9/28/2022, 11:33:05 AM',
        '1h 3m 1s',
        'Finished',
        'MockedJobsViewResultCell',
      ],
      ['diku', 'Periodic', '9/29/2022, 10:30:04 AM', '', '', 'Scheduled', ''],
    ];

    renderJobView(jobsFixture);
    const rowContent = screen.getAllByRole('row').map((row) => within(row)
      .queryAllByRole(/gridcell|button/)
      .map((e) => e.textContent));
    expect(rowContent).toEqual(expectedRowContent);
  });
});
