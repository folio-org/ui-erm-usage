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
