import React from 'react';
import '../../../test/jest/__mock__';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import udpsFixture from '../../../test/fixtures/udps';
import jobsFixture from '../../../test/fixtures/jobs';
import JobsViewRoute from '../../routes/JobsViewRoute';

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
    renderJobView(jobsFixture);

    expect(screen.queryByText('The list contains no items')).toBeNull();

    expect(screen.queryByText('American Chemical Society')).toBeInTheDocument();
    expect(screen.queryByText('Provider', { exact: true })).toBeInTheDocument();
    expect(screen.queryByText('9/28/2022, 11:33:03 AM')).toBeInTheDocument();
    expect(screen.queryByText('9/28/2022, 11:33:04 AM')).toBeInTheDocument();
    expect(screen.queryByText('0m 1s')).toBeInTheDocument();

    expect(screen.queryByText('diku')).toBeInTheDocument();
    expect(screen.queryByText('Tenant', { exact: true })).toBeInTheDocument();
    expect(screen.queryByText('9/28/2022, 10:30:04 AM')).toBeInTheDocument();
    expect(screen.queryByText('9/28/2022, 11:33:05 AM')).toBeInTheDocument();
    expect(screen.queryByText('1h 3m 1s')).toBeInTheDocument();
  });
});
