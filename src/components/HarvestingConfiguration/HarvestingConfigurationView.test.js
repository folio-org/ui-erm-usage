import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import harvesterImpls from '../../../test/fixtures/harvesterImpls';
import settings from '../../../test/fixtures/settings';
import udp from '../../../test/fixtures/udp';
import renderWithIntl from '../../../test/jest/helpers';
import { splitHarvesterImpls } from '../../util/harvesterImpls';
import HarvestingConfigurationView from './HarvestingConfigurationView';

const onToggle = jest.fn;

jest.mock('./AggregatorInfo/AggregatorContactInfo', () => {
  return () => <span>AggregatorContactInfo</span>;
});

const renderHarvestingConfigurationView = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        harvesterImpls={harvesterImpls}
        onToggle={onToggle}
        settings={settings}
        stripes={{ hasPerm: () => true }}
        usageDataProvider={udp}
      />
    </MemoryRouter>
  );
};

const renderHarvestingConfigurationViewWithoutPerms = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        harvesterImpls={harvesterImpls}
        onToggle={onToggle}
        settings={settings}
        stripes={{ hasPerm: () => false }}
        usageDataProvider={udp}
      />
    </MemoryRouter>
  );
};

describe('HarvestingConfigurationView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('should render HarvestingConfigurationView', async () => {
    await renderHarvestingConfigurationView(stripes);
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
  });

  test('render with permissions should render aggregator name as link', async () => {
    await renderHarvestingConfigurationView(stripes);
    expect(screen.getByText('German National Statistics Server')).toHaveAttribute('href');
  });

  test('render without permissions should render aggregator name without link', async () => {
    await renderHarvestingConfigurationViewWithoutPerms(stripes);
    expect(screen.getByText('German National Statistics Server')).not.toHaveAttribute('href');
  });
});

describe('HarvestingConfigurationView with unsupported values', () => {
  const implementations = [{ type: 'cs51', name: 'Counter Sushi 5.1', reportRelease: '5.1' }];
  const harvesterImplRecords = [{ implementations }];

  const createUdp = ({ harvestVia, reportRelease, serviceType }) => ({
    ...udp,
    harvestingConfig: {
      ...udp.harvestingConfig,
      harvestVia,
      reportRelease,
      sushiConfig: serviceType ? { serviceType, serviceUrl: 'http://example.com' } : undefined,
    },
  });

  const renderView = (usageDataProvider, impls = harvesterImplRecords) => {
    return renderWithIntl(
      <MemoryRouter>
        <HarvestingConfigurationView
          harvesterImpls={impls}
          onToggle={onToggle}
          settings={settings}
          stripes={{ hasPerm: () => true }}
          usageDataProvider={usageDataProvider}
        />
      </MemoryRouter>
    );
  };

  // the report release is always shown as it is, independent of the service type
  describe.each(['aggregator', 'sushi'])('report release with harvestVia %s', (harvestVia) => {
    test.each([
      ['supported', 'cs51'],
      ['unsupported', 'cs41'],
      ['no', undefined],
    ])('should render report release without suffix for %s service type', (_description, serviceType) => {
      renderView(createUdp({ harvestVia, reportRelease: '4', serviceType }));
      expect(screen.getByText('Counter 4')).toBeInTheDocument();
      expect(screen.queryByText('Counter 4 (Unsupported)')).not.toBeInTheDocument();
    });
  });

  // the service type is only displayed for UDPs that are not harvested via aggregator
  describe('service type', () => {
    test('should render supported service type without suffix', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '5.1', serviceType: 'cs51' }));
      expect(screen.getByText('Counter Sushi 5.1')).toBeInTheDocument();
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });

    test('should append (Unsupported) to unsupported service type', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '5.1', serviceType: 'cs41' }));
      expect(screen.getByText('cs41 (Unsupported)')).toBeInTheDocument();
      expect(screen.getByText('Counter 5.1')).toBeInTheDocument();
    });

    test('should not append (Unsupported) while implementations are not loaded', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '5.1', serviceType: 'cs41' }), []);
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });
  });
});

describe('HarvestingConfigurationView with unsupported aggregator', () => {
  const nssUdp = {
    ...udp,
    harvestingConfig: {
      ...udp.harvestingConfig,
      aggregator: {
        ...udp.harvestingConfig.aggregator,
        name: 'Nationaler Statistikserver',
      },
    },
  };

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

  const renderView = (aggregatorImpls) => {
    return renderWithIntl(
      <MemoryRouter>
        <HarvestingConfigurationView
          aggregatorImpls={aggregatorImpls}
          aggregators={aggregators}
          harvesterImpls={harvesterImpls}
          onToggle={onToggle}
          settings={settings}
          stripes={{ hasPerm: () => true }}
          usageDataProvider={nssUdp}
        />
      </MemoryRouter>
    );
  };

  test('should render supported aggregator without suffix', () => {
    renderView([{ implementations: [{ type: 'NSS', isAggregator: true }] }]);
    expect(screen.getByText('Nationaler Statistikserver')).toBeInTheDocument();
    expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
  });

  // the view route passes the result of splitHarvesterImpls, not an empty array
  test('should not append (Unsupported) while implementations are not loaded', () => {
    renderView(splitHarvesterImpls(undefined).aggregatorImpls);
    expect(screen.getByText('Nationaler Statistikserver')).toBeInTheDocument();
    expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
  });

  test('should append (Unsupported) to aggregator with unsupported service type', () => {
    renderView([{ implementations: [{ type: 'OTHER', isAggregator: true }] }]);
    expect(screen.getByText('Nationaler Statistikserver (Unsupported)')).toBeInTheDocument();
  });
});
