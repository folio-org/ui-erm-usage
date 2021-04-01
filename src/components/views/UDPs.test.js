import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import udp from '../../../test/fixtures/udp';
import aggregator from '../../../test/fixtures/aggregator';
import UDPs from './UDPs';

const testUDP = {
  logger: { log: noop },
  mutator: { sources: {}, query: {}, resultCount: {} },
  props: {
    history: {},
    location: {},
    match: {},
    staticContext: undefined,
    children: {},
  },
  recordsObj: {},
  resources: {
    usageDataProviders: {},
    aggregatorSettings: {},
    harvesterImpls: {},
    errorCodes: {},
    reportTypes: {},
    query: { query: '', filters: 'status.active', sort: 'label' },
    resultCount: 30,
  },
};

const connectedTestSource = new StripesConnectedSource(
  testUDP.props,
  testUDP.logger,
  'usageDataProviders'
);

const renderUDPs = (stripes) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <UDPs
        data={{
          udps: [udp],
          aggregators: [aggregator],
          tags: [],
          errorCodes: ['3030', '3031', 'other'],
          reportTypes: ['BR', 'TR'],
        }}
        selectedRecordId={''}
        onNeedMoreData={jest.fn()}
        queryGetter={jest.fn()}
        querySetter={jest.fn()}
        searchString={'status.active'}
        source={connectedTestSource}
      />
    </StripesContext.Provider>
  </MemoryRouter>
);

describe('UDPs SASQ View', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderUDPs(stripes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane sourceresults should be visible', () => {
    expect(screen.getByText('Usage data providers')).toBeVisible();
  });

  describe('check filters', () => {
    it('harvesting status filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-harvestingStatus')
      ).toBeInTheDocument();
    });

    it('harvestVia filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-harvestVia')
      ).toBeInTheDocument();
    });

    it('aggregators filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-aggregators')
      ).toBeInTheDocument();
    });

    it('report types filter should be present', () => {
      expect(
        document.querySelector('#clickable-report-types-filter')
      ).toBeInTheDocument();
    });

    it('has failed reports filter should be present', () => {
      expect(
        document.querySelector('#filter-accordion-hasFailedReport')
      ).toBeInTheDocument();
    });

    it('error codes filter should be present', () => {
      expect(
        document.querySelector('#clickable-error-codes-filter')
      ).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(
        document.querySelector('#clickable-reset-all')
      ).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#input-udp-search')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#clickable-search-udps')).toBeInTheDocument();
    });
  });

  // TODO: list of results will not rendered yet
});
