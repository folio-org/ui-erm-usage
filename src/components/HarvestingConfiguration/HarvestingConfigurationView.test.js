import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers';

import HarvestingConfigurationView from './HarvestingConfigurationView';
import udp from '../../../test/fixtures/udp';
import harvesterImpls from '../../../test/fixtures/harvesterImpls';
import settings from '../../../test/fixtures/settings';

const onToggle = jest.fn;

jest.mock('./AggregatorInfo/AggregatorContactInfo', () => {
  return () => <span>AggregatorContactInfo</span>;
});

const renderHarvestingConfigurationView = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        usageDataProvider={udp}
        stripes={{ hasPerm: () => true }}
        onToggle={onToggle}
        settings={settings}
        harvesterImpls={harvesterImpls}
      />
    </MemoryRouter>
  );
};

const renderHarvestingConfigurationViewWithoutPerms = () => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        usageDataProvider={udp}
        stripes={{ hasPerm: () => false }}
        onToggle={onToggle}
        settings={settings}
        harvesterImpls={harvesterImpls}
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
