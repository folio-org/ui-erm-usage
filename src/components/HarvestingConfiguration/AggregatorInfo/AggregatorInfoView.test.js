import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import udp from '../../../../test/fixtures/udp';
import renderWithIntl from '../../../../test/jest/helpers';
import AggregatorInfoView from './AggregatorInfoView';

const aggregators = [
  {
    aggregatorSettings: [
      {
        id: udp.harvestingConfig.aggregator.id,
        label: 'Nationaler Statistikserver',
        serviceType: 'NSS',
      },
    ],
  },
];

const renderAggregatorInfoView = (stripes, aggregatorImpls) => {
  return renderWithIntl(
    <MemoryRouter>
      <AggregatorInfoView
        aggregatorImpls={aggregatorImpls}
        aggregators={aggregators}
        stripes={stripes}
        usageDataProvider={udp}
      />
    </MemoryRouter>
  );
};

describe('AggregatorInfoView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render aggregator name without suffix if service type is supported', () => {
    renderAggregatorInfoView(stripes, [{ implementations: [{ type: 'NSS', name: 'Nationaler Statistikserver' }] }]);
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
  });

  test('should render aggregator name with unsupported suffix if service type is not supported', () => {
    renderAggregatorInfoView(stripes, [{ implementations: [{ type: 'cs51', name: 'Counter Sushi 5.1' }] }]);
    expect(screen.getByText('German National Statistics Server (Unsupported)')).toBeVisible();
  });

  test('should render aggregator name without suffix while aggregator implementations are not loaded', () => {
    renderAggregatorInfoView(stripes, []);
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
    expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
  });

  test('should render aggregator name without suffix if aggregator setting is not found', () => {
    renderWithIntl(
      <MemoryRouter>
        <AggregatorInfoView
          aggregatorImpls={[{ implementations: [{ type: 'NSS' }] }]}
          aggregators={[{ aggregatorSettings: [] }]}
          stripes={stripes}
          usageDataProvider={udp}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
    expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
  });
});
