import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import filterGroups from '../../util/data/filterGroupsJobsView';
import JobsFilter from './JobsFilter';

let testLocation;

const renderJobFilter = (providerId, id, label) => {
  const search = providerId ? `?providerId=${providerId}` : undefined;
  const state = id || label ? { provider: { id, label } } : undefined;

  return renderWithIntl(
    <MemoryRouter
      initialEntries={[{ pathname: '/eusage/jobs', search, state }]}
    >
      <JobsFilter
        filterGroups={filterGroups}
        activeFilters={{ state: { filters: [] } }}
        getFilterHandlers={() => {}}
      />
      <Route
        path="*"
        render={({ location }) => {
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );
};

describe('JobFilter component tests', () => {
  test('that UDP accordion is not rendered if no state and no param is provided', () => {
    renderJobFilter();
    expect(screen.queryByText('Usage data provider')).not.toBeInTheDocument();
    expect(screen.queryByText('Running status')).toBeInTheDocument();
    expect(screen.queryByText('Job types')).toBeInTheDocument();
  });

  test('that UDP checkbox is checked and labeled with param value if no location state is present', () => {
    renderJobFilter('f3712487-7ca4-4e46-968c-5239ec9da5a1');
    expect(screen.queryByText('Usage data provider')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /f3712487-7ca4-4e46-968c-5239ec9da5a1/ })).toBeChecked();
    expect(screen.queryByText('Running status')).toBeInTheDocument();
    expect(screen.queryByText('Job types')).toBeInTheDocument();
  });

  test('that checkbox toggle sets query param and keeps location state', () => {
    const expectedProviderState = {
      id: 'f3712487-7ca4-4e46-968c-5239ec9da5a1',
      label: 'ProviderXY',
    };

    renderJobFilter(
      'f3712487-7ca4-4e46-968c-5239ec9da5a1',
      'f3712487-7ca4-4e46-968c-5239ec9da5a1',
      'ProviderXY'
    );

    const checkbox = screen.getByRole('checkbox', { name: /ProviderXY/ });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox); // uncheck
    expect(testLocation.state.provider).toStrictEqual(expectedProviderState);
    expect(
      new URLSearchParams(testLocation.search).get('providerId')
    ).toBeNull();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox); // check
    expect(testLocation.state.provider).toStrictEqual(expectedProviderState);
    expect(new URLSearchParams(testLocation.search).get('providerId')).toBe(
      'f3712487-7ca4-4e46-968c-5239ec9da5a1'
    );
    expect(checkbox).toBeChecked();
  });
});
