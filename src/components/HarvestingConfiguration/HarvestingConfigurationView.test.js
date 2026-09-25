import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import harvesterImpls from '../../../test/fixtures/harvesterImpls';
import settings from '../../../test/fixtures/settings';
import udp from '../../../test/fixtures/udp';
import renderWithIntl from '../../../test/jest/helpers';
import HarvestingConfigurationView from './HarvestingConfigurationView';

const onToggle = jest.fn;

const renderHarvestingConfigurationView = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        harvesterImpls={harvesterImpls}
        onToggle={onToggle}
        settings={settings}
        usageDataProvider={udp}
      />
    </MemoryRouter>
  );
};

describe('HarvestingConfigurationView', () => {
  test('should render HarvestingConfigurationView', async () => {
    await renderHarvestingConfigurationView();
    expect(screen.getByText('Counter 5.1')).toBeVisible();
    expect(screen.getByText('https://sushi.example.org/counter/r5')).toBeVisible();
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
          usageDataProvider={usageDataProvider}
        />
      </MemoryRouter>
    );
  };

  // the report release is always shown as it is, independent of the service type
  describe('report release', () => {
    test.each([
      ['supported', 'cs51'],
      ['unsupported', 'cs41'],
      ['no', undefined],
    ])('should render report release without suffix for %s service type', (_description, serviceType) => {
      renderView(createUdp({ harvestVia: 'sushi', reportRelease: '4', serviceType }));
      expect(screen.getByText('Counter 4')).toBeInTheDocument();
      expect(screen.queryByText('Counter 4 (Unsupported)')).not.toBeInTheDocument();
    });
  });

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
