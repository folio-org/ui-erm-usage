import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import AggregatorInteractor from '../interactors/aggregator';

describe('Aggregators', () => {
  setupApplication();

  const agg = new AggregatorInteractor();

  beforeEach(function () {
    this.server.createList('aggregator-setting', 3);
    this.visit('/settings/eusage/aggregators');
  });

  it('shows the list of aggregator items', () => {
    expect(agg.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(agg.instances().length).to.be.gte(3);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await agg.instances(0).click();
    });

    it('loads the instance details', function () {
      expect(agg.instance.isVisible).to.equal(true);
    });
  });
});
