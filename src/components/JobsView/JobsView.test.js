import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import jobsFixture from '../../../test/fixtures/jobs';
import udpsFixture from '../../../test/fixtures/udps';
import Intl from '../../../test/jest/__mock__/intl.mock';
import StripesQueryProvider from '../../../test/jest/helpers/StripesQueryProvider';
import stubHarvester from '../../../test/jest/helpers/stubHarvester';
import JobsViewRoute from '../../routes/JobsViewRoute';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

jest.mock('./JobsViewResultCell', () => () => (
  <div>MockedJobsViewResultCell</div>
));

const HEADER_ROW = 1;

const manyJobs = (count) => Array.from({ length: count }, (unused, i) => ({
  id: `job-${i}`,
  type: 'tenant',
  startedAt: '2022-09-28T10:30:04.305+00:00',
  finishedAt: '2022-09-28T11:33:05.305+00:00',
  result: 'success',
}));

const app = (visible = true) => (
  <Intl locale="en">
    <StripesQueryProvider>
      <MemoryRouter>
        {visible ? (
          <JobsViewRoute
            resources={{
              query: { sort: '' },
              udps: { records: udpsFixture },
            }}
          />
        ) : null}
      </MemoryRouter>
    </StripesQueryProvider>
  </Intl>
);

const renderJobView = () => render(app());

const awaitRows = (count) => waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(count + HEADER_ROW));

const awaitPagingStopped = async (requests) => {
  let seen = -1;
  let stableFor = 0;

  await waitFor(() => {
    stableFor = requests.length === seen ? stableFor + 1 : 0;
    seen = requests.length;

    if (stableFor < 3) {
      throw new Error(`still paging: ${requests.length} requests so far`);
    }
  }, { interval: 100, timeout: 5000 });
};

const revisit = (rerender) => {
  rerender(app(false));
  rerender(app(true));
};

describe('JobView component', () => {
  let now;

  beforeEach(() => {
    now = 1700000000000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display no results if the harvester returns none', async () => {
    stubHarvester([]);

    renderJobView();

    expect(
      await screen.findByText('The list contains no items')
    ).toBeInTheDocument();
  });

  it('should display properly formatted results if job data is provided', async () => {
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
        '',
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

    stubHarvester(jobsFixture);

    renderJobView();
    await awaitRows(jobsFixture.length);

    const rowContent =
      screen.getAllByRole('row').map((row) => ['columnheader', 'gridcell'].flatMap((role) => within(row)
        .queryAllByRole(role)
        .map((e) => e.textContent)));
    expect(rowContent).toEqual(expectedRowContent);
  });

  it('should pin the job list to a snapshot taken when the page is opened', async () => {
    const requests = stubHarvester(jobsFixture);

    renderJobView();
    await awaitRows(jobsFixture.length);

    expect(requests).toEqual([
      {
        limit: '30',
        offset: '0',
        providerId: '',
        query: '(cql.allRecords=1) sortby startedAt/sort.descending',
        timestamp: String(now),
      },
    ]);
  });

  it('should take a new snapshot on each visit', async () => {
    const requests = stubHarvester(jobsFixture);

    const { rerender } = renderJobView();
    await awaitRows(jobsFixture.length);

    now += 180000;
    revisit(rerender);
    await waitFor(() => expect(requests).toHaveLength(2));

    expect(requests[1].timestamp).toBe(String(now));
    expect(Number(requests[1].timestamp)).toBeGreaterThan(
      Number(requests[0].timestamp)
    );
  });

  it('should take a new snapshot when the refresh button is clicked', async () => {
    const requests = stubHarvester(jobsFixture);

    renderJobView();
    await awaitRows(jobsFixture.length);

    now += 60000;
    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(requests).toHaveLength(2));

    expect(requests[1].timestamp).toBe(String(now));
  });

  it('should not ask for more rows before the first page lands or once the list is complete', async () => {
    const requests = stubHarvester(jobsFixture);

    renderJobView();
    await awaitRows(jobsFixture.length);

    expect(requests).toHaveLength(1);
    expect(requests[0].limit).toBe('30');
  });

  it('should stop paging once the viewport is filled', async () => {
    const total = 213;
    const requests = stubHarvester(manyJobs(total));

    renderJobView();
    await awaitPagingStopped(requests);

    expect(screen.getAllByRole('row').length).toBeLessThan(total / 2);
    expect(Number(requests[requests.length - 1].offset)).toBeLessThan(total - 60);
  });
});
