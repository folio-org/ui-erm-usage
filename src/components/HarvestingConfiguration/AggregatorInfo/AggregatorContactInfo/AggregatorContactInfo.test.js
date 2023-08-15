import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';

import { server, rest } from '../../../../../test/jest/testServer';
import AggregatorContactInfo from './AggregatorContactInfo';

const aggregatorId = '5b6ba83e-d7e5-414e-ba7b-134749c0d950';

const renderAggregatorContactInfo = (stripes) => {
  return render(
    <AggregatorContactInfo stripes={stripes} aggregatorId={aggregatorId} />
  );
};

describe('AggregatorContactInfo', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render AggregatorContactInfo', async () => {
    renderAggregatorContactInfo(stripes);
    await screen.findByRole('button');
    await userEvent.click(await screen.findByRole('button'));
    expect(await screen.findByText('John Doe')).toBeVisible();
  });

  test('should render error on 404', async () => {
    server.use(
      rest.get(
        'https://folio-testing-okapi.dev.folio.org/aggregator-settings/:aggregatorId',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    renderAggregatorContactInfo(stripes);
    await screen.findByRole('button');
    await userEvent.click(await screen.findByRole('button'));
    expect(await screen.findByText(/Error retrieving aggregator info by id/i)).toBeVisible();
  });
});
