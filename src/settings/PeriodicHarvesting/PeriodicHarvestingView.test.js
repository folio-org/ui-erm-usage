import React from 'react';
import { screen } from '@testing-library/react';
import _ from 'lodash';
import renderWithIntl from '../../../test/jest/helpers';
import PeriodicHarvestingView from './PeriodicHarvestingView';

const periodicConfig = {
  id: '8bf5fe33-5ec8-420c-a86d-6320c55ba554',
  startAt: '2021-05-07T12:13:19.000+0000',
  lastTriggeredAt: '2021-05-07T12:13:22.701+0000',
  periodicInterval: 'daily'
};

const renderPeriodicHarvestingView = (initialVals = {}) => {
  return renderWithIntl(
    <PeriodicHarvestingView
      periodicConfig={initialVals}
    />
  );
};

describe('PeriodicHarvestingView', () => {
  test('initialValues are rendered correctly', () => {
    renderPeriodicHarvestingView(periodicConfig);
    expect(screen.getByText('05/07/2021')).toBeVisible();
    expect(screen.getByText('12:13 PM')).toBeVisible();
    expect(screen.getByText('Daily')).toBeVisible();
    expect(screen.getByText('May 7, 2021 12:13 PM')).toBeVisible();
  });

  test('missing lastTriggeredAt is rendered correctly', () => {
    renderPeriodicHarvestingView(_.omit(periodicConfig, 'lastTriggeredAt'));
    expect(screen.getByText('--')).toBeVisible();
  });

  test('not defined text is rendered', () => {
    renderPeriodicHarvestingView();
    expect(
      screen.getByText(
        'Periodic harvesting is not defined and thus not enabled. Click + to define periodic harvesting.'
      )
    ).toBeVisible();
  });
});
