import {
  beforeEach,
  describe,
  it
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import AggregatorEditPage from '../interactors/aggregator-edit-page';
import AggregatorInteractor from '../interactors/aggregator';

describe('Edit Aggregator', () => {
  setupApplication();
  const aggregatorInteractor = new AggregatorInteractor();
  const aggregatorEditPage = new AggregatorEditPage();

  let aggregator = null;

  beforeEach(async function () {
    aggregator = this.server.create('aggregator-setting');
    return this.visit('/settings/eusage/aggregators', () => {
      expect(aggregatorInteractor.$root).to.exist;
    });
  });

  describe('Aggregator edit form is displayed ', () => {
    beforeEach(async function () {
      return this.visit(`/settings/eusage/aggregators/${aggregator.id}?layer=edit`);
    });

    it('displays Edit Aggregator form', () => {
      expect(aggregatorEditPage.$root).to.exist;
    });
  });
});
