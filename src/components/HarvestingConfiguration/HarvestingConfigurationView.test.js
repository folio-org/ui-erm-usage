import React from 'react';
import { screen } from '@testing-library/react';
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

const renderHarvestingConfigurationView = (stripes) => {
  return renderWithIntl(
    <MemoryRouter>
      <HarvestingConfigurationView
        usageDataProvider={udp}
        stripes={stripes}
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
    expect(screen.getByText('Harvesting status')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('German National Statistics Server')).toBeVisible();
  });
});
