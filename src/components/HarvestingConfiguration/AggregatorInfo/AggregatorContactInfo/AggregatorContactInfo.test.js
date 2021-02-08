import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../../../test/jest/__mock__';
import { server, rest } from '../../../../../test/jest/testServer';
import AggregatorContactInfo from './AggregatorContactInfo';

const stripes = {
  actionNames: [],
  clone: () => ({ ...stripes }),
  connect: () => {},
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => {},
  setCurrency: () => {},
  setLocale: () => {},
  setSinglePlugin: () => {},
  setTimezone: () => {},
  setToken: () => {},
  store: {
    getState: () => ({
      okapi: {
        token: 'abc',
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
};

const aggregatorId = '5b6ba83e-d7e5-414e-ba7b-134749c0d950';

const renderAggregatorContactInfo = () => {
  return render(
    <AggregatorContactInfo stripes={stripes} aggregatorId={aggregatorId} />
  );
};

describe('AggregatorContactInfo', () => {
  test('should render AggregatorContactInfo', async () => {
    renderAggregatorContactInfo();
    await screen.findByRole('button');
    userEvent.click(await screen.findByRole('button'));
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
    renderAggregatorContactInfo();
    await screen.findByRole('button');
    userEvent.click(await screen.findByRole('button'));
    expect(
      await screen.findByText(/Error retrieving aggregator info by id/i)
    ).toBeVisible();
  });
});
