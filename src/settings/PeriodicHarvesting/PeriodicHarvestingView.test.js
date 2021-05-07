import React from 'react';
import { screen } from '@testing-library/react';
import renderWithIntl from '../../../test/jest/helpers';

import PeriodicHarvestingView from './PeriodicHarvestingView';
const initialValues = {
  id: '8bf5fe33-5ec8-420c-a86d-6320c55ba554',
  startAt: '2021-05-07T12:13:19.000+0000',
  lastTriggeredAt: '2021-05-07T12:13:22.701+0000',
  periodicInterval: 'daily',
  startDate: '2021-05-07',
  startTime: '12:13:19.000+0000',
};

const timeFormat = 'h:mm A';
const timeZone = 'UTC';

const renderPeriodicHarvestingView = (initialVals = {}) => {
  return renderWithIntl(
    <PeriodicHarvestingView
      initialValues={initialVals}
      timeFormat={timeFormat}
      timeZone={timeZone}
    />
  );
};

describe('PeriodicHarvestingView', () => {
  test('initialValues are rendered correctly', () => {
    renderPeriodicHarvestingView(initialValues);
    expect(screen.getByText('2021-05-07')).toBeVisible();
    expect(screen.getByText('12:13 PM')).toBeVisible();
    expect(screen.getByText('daily')).toBeVisible();
    expect(screen.getByText('May 7, 2021 2:13 PM')).toBeVisible();
  });

  test('initialValues are rendered correctly', () => {
    renderPeriodicHarvestingView();
    expect(
      screen.getByText(
        'Periodic harvesting is not defined and thus not enabled. Click + to define periodic harvesting.'
      )
    ).toBeVisible();
  });
});
