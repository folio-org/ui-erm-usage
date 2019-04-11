
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import AggregatorDetailsPage from '../interactors/aggregator-details-page';
import AggregatorInteractor from '../interactors/aggregator';

describe('Aggregator Details Page', () => {
  setupApplication();
  const aggregatorDetailsPage = new AggregatorDetailsPage();
  const aggregatorInteractor = new AggregatorInteractor();

  beforeEach(async function () {
    this.server.create('aggregator-setting');
    this.visit('/settings/eusage/aggregators');
  });

  it('shows the list of aggregator items', () => {
    expect(aggregatorInteractor.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(aggregatorInteractor.instances().length).to.be.gte(1);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await aggregatorInteractor.instances(0).click();
    });

    it('all accordions are present', function () {
      expect(aggregatorDetailsPage.generalInfoAccordion.isPresent).to.equal(true);
      expect(aggregatorDetailsPage.aggregatorConfigAccordion.isPresent).to.equal(true);
      expect(aggregatorDetailsPage.accountConfigAccordion.isPresent).to.equal(true);
    });
  });
});
