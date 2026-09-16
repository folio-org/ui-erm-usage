import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import harvesterImpls from '../../../test/fixtures/harvesterImpls';
import settings from '../../../test/fixtures/settings';
import udp from '../../../test/fixtures/udp';
import renderWithIntl from '../../../test/jest/helpers';
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

  // if the service type is unsupported, the report release shows the service type instead
  describe('report release with harvestVia sushi', () => {
    test('should render report release without suffix if service type is supported', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '5.1', serviceType: 'cs51' }));
      expect(screen.getByText('Counter 5.1')).toBeInTheDocument();
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });

    test('should show service type with (Unsupported) as report release if service type is unsupported', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '4', serviceType: 'cs41' }));
      // service type label and report release label
      expect(screen.getAllByText('cs41 (Unsupported)')).toHaveLength(2);
      expect(screen.queryByText(/Counter 4/)).not.toBeInTheDocument();
    });

    test('should not append (Unsupported) while implementations are not loaded', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '4', serviceType: 'cs41' }), []);
      expect(screen.getByText('Counter 4')).toBeInTheDocument();
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });
  });

  // the service type is kept when switching from sushi to aggregator
  describe('report release with harvestVia aggregator', () => {
    test('should not append (Unsupported) without service type', () => {
      renderView(createUdp({ harvestVia: 'aggregator', reportRelease: '4' }));
      expect(screen.getByText('Counter 4')).toBeInTheDocument();
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });

    test('should show service type with (Unsupported) as report release with leftover unsupported service type', () => {
      renderView(createUdp({ harvestVia: 'aggregator', reportRelease: '4', serviceType: 'cs41' }));
      expect(screen.getByText('cs41 (Unsupported)')).toBeInTheDocument();
      expect(screen.queryByText(/Counter 4/)).not.toBeInTheDocument();
    });

    test('should show service type with (Unsupported) as report release without report release', () => {
      renderView(createUdp({ harvestVia: 'aggregator', serviceType: 'cs41' }));
      expect(screen.getByText('cs41 (Unsupported)')).toBeInTheDocument();
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
      // service type label and report release label
      expect(screen.getAllByText('cs41 (Unsupported)')).toHaveLength(2);
    });

    test('should not append (Unsupported) while implementations are not loaded', () => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '5.1', serviceType: 'cs41' }), []);
      expect(screen.queryByText(/\(Unsupported\)/)).not.toBeInTheDocument();
    });
  });
});
